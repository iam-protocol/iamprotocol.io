"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { parseEmbedParams, type ParsedEmbedParams } from "@/lib/embed/url-params";

type RouteState =
  | { kind: "loading" }
  | { kind: "valid"; params: ParsedEmbedParams }
  | { kind: "invalid"; reason: "origin_invalid" | "unknown" };

/**
 * Embed/verify-popup route.
 *
 * Parses and validates URL parameters that the integrator's `<EntrosVerify>`
 * component supplied when opening the popup. Validation failures render an
 * opaque error block; successful parses fall through to the verification
 * pipeline composition (added in subsequent blocks).
 *
 * Block 1: skeleton — parameter validation only. No postMessage emission,
 * no integrator allowlist enforcement, no verification work yet.
 */
export default function EmbedVerifyPopupPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<RouteState>({ kind: "loading" });

  useEffect(() => {
    if (!searchParams) {
      setState({ kind: "invalid", reason: "unknown" });
      return;
    }
    const result = parseEmbedParams(new URLSearchParams(searchParams.toString()));
    if (result.ok) {
      setState({ kind: "valid", params: result.params });
    } else {
      setState({ kind: "invalid", reason: result.reason });
    }
  }, [searchParams]);

  if (state.kind === "loading") {
    return <PopupShell>{null}</PopupShell>;
  }

  if (state.kind === "invalid") {
    return (
      <PopupShell>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            // ERROR
          </p>
          <p className="mt-4 text-sm text-foreground/70">
            This integration is not authorized.
          </p>
        </div>
      </PopupShell>
    );
  }

  return (
    <PopupShell>
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          // POPUP READY
        </p>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          Verification will run here<span className="text-cyan">.</span>
        </h1>
        <p className="mt-4 text-xs leading-relaxed text-foreground/55">
          Pipeline composition lands in subsequent commits on this branch.
        </p>
        <dl className="mx-auto mt-6 grid max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-left font-mono text-[11px] text-foreground/45">
          <dt>integrator</dt>
          <dd className="text-foreground/70">{state.params.integratorKey}</dd>
          <dt>cluster</dt>
          <dd className="text-foreground/70">{state.params.cluster}</dd>
          <dt>parent</dt>
          <dd className="truncate text-foreground/70">
            {state.params.parentOrigin}
          </dd>
          <dt>request</dt>
          <dd className="truncate text-foreground/70">
            {state.params.requestId}
          </dd>
          {state.params.minTrustScore !== undefined && (
            <>
              <dt>floor</dt>
              <dd className="text-foreground/70">{state.params.minTrustScore}</dd>
            </>
          )}
        </dl>
      </div>
    </PopupShell>
  );
}

function PopupShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <span className="font-wordmark text-xl tracking-tight text-foreground">
          Entros<span className="text-cyan">.</span>
        </span>
        <button
          type="button"
          onClick={() => window.close()}
          className="font-mono text-xs text-foreground/40 transition-colors hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        {children}
      </main>
      <footer className="border-t border-border px-5 py-3 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/30">
          powered by entros.io
        </span>
      </footer>
    </div>
  );
}
