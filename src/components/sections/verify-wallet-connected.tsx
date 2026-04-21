"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import type { PulseSession } from "@iam-protocol/pulse-sdk";
import type { VerifyState, VerifyAction } from "@/components/verify/types";
import { PulseChallenge } from "@/components/verify/pulse-challenge";
import {
  ProvingView,
  SigningView,
  VerifiedView,
  FailedView,
} from "@/components/verify/step-views";
import { ResetBaselineDialog } from "@/components/verify/reset-baseline-dialog";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { usePulse } from "@/components/providers/pulse-provider";
import { Wallet } from "lucide-react";

function commitmentToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function VerifyWalletConnected({
  state,
  dispatch,
}: {
  state: VerifyState;
  dispatch: React.ActionDispatch<[action: VerifyAction]>;
}) {
  const { connected, wallet, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const pulse = usePulse();
  const touchRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<PulseSession | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasMotion, setHasMotion] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [processingStage, setProcessingStage] = useState("Extracting features...");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const startingRef = useRef(false);
  const voicedFramesRef = useRef(0);
  // Intent is tracked alongside the state-machine mirror so the
  // capture-completion handler can choose between verify vs reset paths
  // without reading the reducer state (which may race the handler).
  const intentRef = useRef<"verify" | "reset">("verify");

  useEffect(() => {
    setHasMotion(navigator.maxTouchPoints > 0);
  }, []);

  async function handleStart(intent: "verify" | "reset" = "verify") {
    if (startingRef.current) return;
    startingRef.current = true;
    intentRef.current = intent;
    setRequesting(true);

    try {
      voicedFramesRef.current = 0;

      // Always attach touch capture to document.body. The PulseChallenge
      // curve DIV is only mounted AFTER we dispatch START_CAPTURE below, so
      // touchRef.current at this point is either null (first run) or a
      // detached node from a prior render (retained because
      // pulse-challenge.tsx assigns the ref manually in a useEffect with
      // no unmount cleanup). Using the detached node silently broke the
      // reset flow: pointer events fired on the new DIV but listeners sat
      // on the dead one, yielding 0 touch samples.
      const session = pulse.createSession(document.body);
      sessionRef.current = session;

      // Motion first — DeviceMotionEvent.requestPermission() requires an active
      // user gesture on iOS. getUserMedia does not. If audio goes first, the gesture
      // token is consumed by the mic dialog and motion is silently denied.
      if (hasMotion) {
        try {
          await session.startMotion();
          if (!session.isMotionCapturing()) {
            dispatch({
              type: "VERIFICATION_FAILED",
              error: "Motion permission denied. Please allow motion access and try again.",
            });
            return;
          }
        } catch {
          dispatch({
            type: "VERIFICATION_FAILED",
            error: "Motion permission denied. Please allow motion access and try again.",
          });
          return;
        }
      } else {
        session.skipMotion();
      }

      // Audio second — getUserMedia works without a gesture on secure origins
      try {
        let audioFrameCount = 0;
        await session.startAudio((rms) => {
          if (rms > 0.008) voicedFramesRef.current++;
          audioFrameCount++;
          if (audioFrameCount % 2 === 0) setAudioLevel(rms);
        });
      } catch {
        dispatch({
          type: "VERIFICATION_FAILED",
          error: "Microphone access denied. Please allow microphone permission and try again.",
        });
        return;
      }

      session.startTouch().catch(() => session.skipTouch());

      dispatch({ type: "START_CAPTURE", intent });
    } finally {
      startingRef.current = false;
      setRequesting(false);
    }
  }

  function handleResetBaselineClick() {
    setResetDialogOpen(true);
  }

  async function handleResetBaselineConfirm() {
    setResetDialogOpen(false);
    // The state machine allows START_CAPTURE from failed (see reducer).
    // Dispatch with reset intent; handleCaptureComplete will route to
    // session.completeReset() because intentRef is now "reset".
    await handleStart("reset");
  }

  async function handleCaptureComplete() {
    const session = sessionRef.current;
    if (!session) return;

    try { await session.stopAudio(); } catch { /* skipped */ }
    try { await session.stopMotion(); } catch { /* skipped */ }
    try { await session.stopTouch(); } catch { /* skipped */ }

    dispatch({ type: "CAPTURE_DONE" });

    const PROOF_TIMEOUT_MS = 60_000;
    const proofPromise =
      intentRef.current === "reset"
        ? session.completeReset(wallet?.adapter, connection, (stage) => {
            setProcessingStage(stage);
          })
        : session.complete(wallet?.adapter, connection, (stage) => {
            setProcessingStage(stage);
          });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Proof generation timed out. Please try again.")), PROOF_TIMEOUT_MS)
    );

    Promise.race([proofPromise, timeoutPromise])
      .then((result) => {
        dispatch({ type: "PROOF_COMPLETE" });
        if (result.success) {
          dispatch({
            type: "VERIFICATION_SUCCESS",
            commitment: commitmentToHex(result.commitment),
            txSignature: result.txSignature,
          });
        } else {
          dispatch({
            type: "VERIFICATION_FAILED",
            error: result.error ?? "Verification failed",
          });
        }
      })
      .catch((err: Error) => {
        dispatch({
          type: "VERIFICATION_FAILED",
          error: err.message ?? "Unexpected error",
        });
      });
  }

  function handleReset() {
    sessionRef.current = null;
    (touchRef as React.MutableRefObject<HTMLDivElement | null>).current = null;
    setAudioLevel(0);
    dispatch({ type: "RESET" });
  }

  if (!connected) {
    return (
      <div className="text-center space-y-6">
        <Wallet className="mx-auto h-10 w-10 text-muted" strokeWidth={1.5} />
        <p className="text-foreground/70 max-w-md mx-auto">
          Connect your Solana wallet to verify with full self-custody. You sign
          the verification transaction directly.
        </p>
        <WalletConnectButton className="!rounded-full !border !border-border !bg-surface !text-foreground !font-mono !text-sm" />
      </div>
    );
  }

  if (state.step === "idle") {
    const truncatedAddress = publicKey
      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      : "";

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-1.5 mb-4">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-xs text-cyan">{truncatedAddress}</span>
            <button
              onClick={() => disconnect()}
              className="ml-1 text-xs text-foreground/40 hover:text-foreground transition-colors"
              aria-label="Disconnect wallet"
            >
              &times;
            </button>
          </div>
          <p className="font-mono text-base font-semibold text-foreground">
            Behavioral Verification
          </p>
          <p className="mt-2 text-sm text-foreground/70 max-w-sm mx-auto">
            Speak a phrase while tracing a shape. All sensors record
            simultaneously for 12 seconds. Then sign with your wallet.
          </p>
        </div>
        <div className={`grid gap-4 mx-auto max-w-sm ${hasMotion ? "grid-cols-3" : "grid-cols-2"}`}>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-cyan font-mono text-xl font-bold">1</span>
            <span className="text-sm text-foreground/70">Speak the displayed phrase</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-solana-green font-mono text-xl font-bold">2</span>
            <span className="text-sm text-foreground/70">Trace the curve on screen</span>
          </div>
          {hasMotion && (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-solana-purple font-mono text-xl font-bold">3</span>
              <span className="text-sm text-foreground/70">Move naturally throughout</span>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <ShimmerButton className="text-sm font-medium" onClick={() => handleStart("verify")} disabled={requesting}>
            {requesting ? "Requesting access..." : "Start Verification"}
          </ShimmerButton>
        </div>
        <p className="text-center text-xs text-muted">
          Raw data stays on your device. Only the ZK proof and a statistical summary leave.
        </p>
      </div>
    );
  }

  if (state.step === "capturing") {
    return (
      <PulseChallenge
        onComplete={handleCaptureComplete}
        touchRef={touchRef}
        audioLevel={audioLevel}
        hasMotion={hasMotion}
      />
    );
  }

  if (state.step === "processing") return <ProvingView stage={processingStage} />;
  if (state.step === "signing") return <SigningView />;

  if (state.step === "verified") {
    const wasReset = state.intent === "reset";
    return (
      <VerifiedView
        commitment={state.commitment}
        txSignature={state.txSignature}
        title={wasReset ? "Baseline reset" : "Verified"}
        subtitle={
          wasReset
            ? "Fresh baseline stored on this device. Trust Score starts at 0 and rebuilds with future verifications."
            : "Transaction confirmed on Solana devnet"
        }
        tryAgainLabel={wasReset ? "Verify now" : "Verify again"}
        onReset={handleReset}
      />
    );
  }

  if (state.step === "failed") {
    return (
      <>
        <FailedView
          error={state.error}
          onReset={handleReset}
          onResetBaseline={handleResetBaselineClick}
        />
        <ResetBaselineDialog
          open={resetDialogOpen}
          onCancel={() => setResetDialogOpen(false)}
          onConfirm={handleResetBaselineConfirm}
        />
      </>
    );
  }

  return null;
}
