import { SubpageHero } from "@/components/sections/subpage-hero";
import { ProtocolStats } from "@/components/sections/protocol-stats";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Devnet Activity",
  description:
    "Live on-chain metrics from Solana devnet.",
  path: "/stats",
});

export default function Stats() {
  return (
    <>
      <SubpageHero
        title="Devnet Activity"
        subtitle="Live on-chain metrics from Solana devnet"
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <ProtocolStats />
      </section>
    </>
  );
}
