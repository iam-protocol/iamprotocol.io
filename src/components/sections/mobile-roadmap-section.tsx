import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowCard } from "@/components/ui/glow-card";
import { mobileRoadmapItems } from "@/data/mobile-roadmap";
import { getIcon } from "@/lib/icons";

export function MobileRoadmapSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="flex items-center gap-3">
        <TextShimmer
          as="span"
          className="font-mono text-base tracking-widest uppercase"
          duration={3}
        >
          {"// COMING TO MOBILE"}
        </TextShimmer>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/5 px-2.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan">
            In development
          </span>
        </span>
      </div>

      <h2 className="mt-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
        Verify on the go.
      </h2>
      <p className="mt-3 max-w-2xl text-foreground/70">
        A Solana Mobile app is in development for the Solana dApp Store, targeting Seeker. Native sensor access unlocks stronger biometric signals than browsers allow, and Trust Score carries across every dApp in the mobile ecosystem.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {mobileRoadmapItems.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <GlowCard key={item.title}>
              <Icon className="mb-6 h-8 w-8 text-foreground/50" strokeWidth={1.5} />
              <h3 className="mb-3 font-sans text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/60">
                {item.description}
              </p>
              <p className="mt-4 text-sm text-foreground/60">
                {item.benefit}
              </p>
            </GlowCard>
          );
        })}
      </div>
    </section>
  );
}
