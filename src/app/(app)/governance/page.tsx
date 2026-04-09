import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { GovernanceContent } from "@/components/sections/governance-content";

export const metadata: Metadata = {
  title: "IAM Governance Plugin",
  description:
    "Human-verified governance for Solana DAOs. Every vote backed by a live, recently verified human.",
};

export default function Governance() {
  return (
    <>
      <SubpageHero
        title="IAM Governance Plugin"
        subtitle="Human-verified governance for Solana DAOs."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <GovernanceContent />
      </section>
    </>
  );
}
