import { TextShimmer } from "@/components/ui/text-shimmer";

export function ThreatModel() {
  return (
    <section id="threat-model" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// THREAT MODEL"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        Who we build against
      </h2>
      <div className="mt-8 space-y-6 text-foreground/80 leading-relaxed">
        <p>
          We assume a well-resourced adversary with access to modern voice
          cloning (XTTS-v2, F5-TTS, ElevenLabs), generative models for
          biometric time-series, full source-code access to our public
          components (SDK, circuits, on-chain programs), unlimited wallets and
          devnet SOL, and days to weeks of time per attack campaign.
        </p>
        <p>
          We do not assume the adversary can compromise user devices, mount
          physical hardware attacks on phones, or access our private
          defense-layer infrastructure. Those are separate threat categories
          covered by standard client-side hardening, hardware root-of-trust
          guidance, and infrastructure security practice respectively.
        </p>
      </div>
    </section>
  );
}
