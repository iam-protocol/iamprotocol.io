"use client";

import { Component, useReducer, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { VerifyMode } from "@/components/verify/types";
import {
  verifyReducer,
  initialState,
} from "@/components/verify/verify-state-machine";
import { GlassPanel } from "@/components/ui/glass-panel";
import { VerifyModeToggle } from "./verify-mode-toggle";
import { VerifyWalletless } from "./verify-walletless";
import { VerifyWalletConnected } from "./verify-wallet-connected";

/**
 * Temporary banner displayed on the verify flow while the validation pipeline
 * is mid-migration. Matches the amber AlertTriangle style used by the devnet
 * and mobile hints in `ui/wallet-connect-button.tsx`. Remove once the
 * pipeline is stable and the SDK version on npm matches the site's lockfile.
 */
function VerifyMaintenanceBanner() {
  return (
    <div className="mx-auto flex max-w-md items-start gap-2 text-xs text-foreground/60 leading-relaxed">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
      <p className="text-left">
        Verification is under maintenance — attempts may fail intermittently.
        Try again shortly.
      </p>
    </div>
  );
}

class VerifyErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message ?? "An unexpected error occurred" };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="text-center space-y-4 py-8">
          <p className="text-sm text-danger">Verification error</p>
          <p className="text-xs text-muted">{this.state.error}</p>
          <button
            onClick={() => {
              this.setState({ error: null });
              this.props.onError();
            }}
            className="rounded-full border border-border px-6 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function VerifyFlow() {
  const [mode, setMode] = useState<VerifyMode>("wallet-connected");
  const [state, dispatch] = useReducer(verifyReducer, initialState);

  function handleModeChange(newMode: VerifyMode) {
    if (state.step !== "idle") {
      dispatch({ type: "RESET" });
    }
    setMode(newMode);
  }

  function handleBoundaryError() {
    dispatch({ type: "RESET" });
  }

  return (
    <div className="space-y-6">
      <VerifyMaintenanceBanner />

      <div className="flex justify-center">
        <VerifyModeToggle mode={mode} onChange={handleModeChange} />
      </div>

      <GlassPanel className="mx-auto max-w-xl rounded-2xl px-8 py-8 min-h-[460px] flex flex-col justify-center">
        <VerifyErrorBoundary onError={handleBoundaryError}>
          {mode === "walletless" ? (
            <VerifyWalletless state={state} dispatch={dispatch} />
          ) : (
            <VerifyWalletConnected state={state} dispatch={dispatch} />
          )}
        </VerifyErrorBoundary>
      </GlassPanel>
    </div>
  );
}
