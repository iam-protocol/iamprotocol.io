import { TextShimmer } from "@/components/ui/text-shimmer";
import { campaignResults, lastUpdated } from "@/data/security-metrics";

export function LatestResults() {
  return (
    <section id="measurements" className="mx-auto max-w-4xl px-6 py-16">
      <TextShimmer
        as="span"
        className="font-mono text-sm tracking-widest uppercase"
      >
        {"// MEASUREMENTS"}
      </TextShimmer>
      <h2 className="mt-4 font-mono text-2xl font-semibold text-foreground md:text-3xl">
        Current measurements
      </h2>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-cyan/20">
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Attack tier
              </th>
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Pass rate
              </th>
              <th scope="col" className="py-3 pr-6 text-left font-mono text-cyan/80">
                Cost per success
              </th>
              <th scope="col" className="py-3 text-left font-mono text-cyan/80">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {campaignResults.map((row) => (
              <tr key={row.tier} className="border-b border-border">
                <td className="py-3 pr-6 font-mono text-foreground">
                  {row.tier}
                </td>
                <td className="py-3 pr-6 text-foreground/80">
                  {row.passRate}
                </td>
                <td className="py-3 pr-6 text-foreground/60">
                  {row.costPerSuccess}
                </td>
                <td className="py-3 text-foreground/60">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-muted">
        Last updated: {lastUpdated}
      </p>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
        Pass rate = fraction of bot attempts that pass server-side Tier 1
        validation, the gate preceding on-chain submission. Cost estimates in
        devnet SOL + wall-clock time per successful identity. Rounded to prevent
        adversarial threshold inference.
      </p>
    </section>
  );
}
