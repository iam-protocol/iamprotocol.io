"use client";

import { ShimmerButton } from "@/components/ui/shimmer-button";

interface CaptureInstructionsProps {
  onBegin: () => void;
}

export default function CaptureInstructions({ onBegin }: CaptureInstructionsProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Pre-capture
        </p>
        <h2 className="font-mono text-2xl font-bold text-foreground">
          Verification Instructions
        </h2>
      </div>

      <ul className="max-w-xs space-y-4 text-sm text-foreground/70">
        <li>You&apos;ll speak a random phrase while tracing a shape on screen</li>
        <li>This takes 12 seconds</li>
        <li>Make sure your microphone and motion sensors are enabled</li>
      </ul>

      <ShimmerButton className="text-sm font-medium" onClick={onBegin}>
        Begin
      </ShimmerButton>
    </div>
  );
}
