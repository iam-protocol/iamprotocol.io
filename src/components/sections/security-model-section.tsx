"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";

const DEFENSES = [
  {
    title: "Minimum Distance Constraint",
    description:
      "The ZK circuit enforces a minimum Hamming distance between consecutive fingerprints. Perfect replay (identical data submitted twice) is rejected at the proof level. Bots that generate the same synthetic data every session cannot pass.",
  },
  {
    title: "Behavioral Entropy Scoring",
    description:
      "The feature extraction pipeline computes Shannon entropy and jitter variance for each sensor stream. Real human data has moderate, fluctuating entropy. Synthetic data produced by TTS engines or scripted inputs is too uniform and gets detected before it reaches the hash stage.",
  },
  {
    title: "Progressive Trust Score",
    description:
      "Trust Score grows with consistent verification over weeks and months, not raw count. 100 verifications in one day scores less than weekly verifications over 3 months. Recency weighting, regularity bonuses, and diminishing age returns make bot farming slow and expensive at scale.",
  },
  {
    title: "Dynamic Challenges",
    description:
      "Phrases and curves change mid-session. A bot that pre-generates synthetic audio for one phrase cannot adapt when the prompt switches. Each session is a unique, unpredictable sequence that forces real-time behavioral adaptation.",
  },
  {
    title: "Economic Disincentives",
    description:
      "Each verification costs ~$0.01 on-chain. Each wallet needs SOL. Maintaining thousands of fake identities over months — each re-verifying regularly to build trust — costs real money. The attack becomes more expensive than the value it extracts.",
  },
];

const MODES = [
  {
    title: "Wallet-Connected",
    description:
      "Connect a Solana wallet. Your IAM Anchor (non-transferable token) is tied to that wallet. Behavioral fingerprint stored on your device, commitment stored on-chain. Trust Score accumulates over time. This is the persistent identity that integrators check.",
    accent: "cyan",
  },
  {
    title: "Walletless",
    description:
      "No wallet, no crypto knowledge needed. The Pulse SDK captures your behavioral data, generates a proof, and the IAM relayer submits it on-chain. Proves 'a human is here right now' but does not build persistent identity. Works as a drop-in captcha replacement.",
    accent: "solana-purple",
  },
];

export function SecurityModelSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
        duration={3}
      >
        {"// SECURITY MODEL"}
      </TextShimmer>

      <h2 className="mt-4 font-mono text-2xl font-bold text-foreground md:text-3xl">
        How IAM resists bots.
      </h2>
      <p className="mt-3 max-w-2xl text-foreground/70">
        No single verification proves humanness. IAM makes Sybil attacks
        economically irrational through layered defenses that increase the cost
        of faking identity at scale.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {DEFENSES.map((d) => (
          <GlowCard key={d.title}>
            <p className="font-mono text-sm font-semibold text-foreground">
              {d.title}
            </p>
            <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
              {d.description}
            </p>
          </GlowCard>
        ))}
      </div>

      <div className="mt-16">
        <TextShimmer
          as="span"
          className="font-mono text-sm tracking-widest uppercase"
          duration={3}
        >
          {"// VERIFICATION MODES"}
        </TextShimmer>

        <h3 className="mt-4 font-mono text-xl font-bold text-foreground">
          Two modes, different guarantees.
        </h3>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {MODES.map((m) => (
            <GlowCard key={m.title}>
              <p className={`font-mono text-base font-semibold text-${m.accent}`}>
                {m.title}
              </p>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                {m.description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
