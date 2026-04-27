import Link from "next/link";
import { SpecialText } from "@/components/ui/special-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FallingPattern } from "@/components/ui/falling-pattern";

/**
 * Custom temporal arrow — chunky chevron preceded by a fading trail
 * that suggests history / forward motion through time.
 */
function TemporalArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 12"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <line
        x1="0"
        y1="6"
        x2="2"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <line
        x1="4"
        y1="6"
        x2="7"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      <path
        d="M9 6 L24 6 M18 1 L24 6 L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-36 pb-32 md:pt-44 md:pb-40 lg:min-h-screen lg:pt-32 lg:pb-32">
      {/* Cypherpunk ink filter — referenced via filter: url(#cypher-ink) on
          the headline. fractalNoise + feDisplacementMap gives organic
          edge irregularity, like ink absorbing into paper. Hidden zero-size
          svg, no layout impact. */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      >
        <defs>
          <filter
            id="cypher-ink"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="2.2"
              numOctaves="1"
              seed="3"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2.4"
            />
          </filter>
        </defs>
      </svg>

      {/* Background dot pattern */}
      <div className="pointer-events-none absolute inset-0 bottom-[-40%] overflow-hidden">
        <FallingPattern className="h-full [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Headline — cyan period pops in after typewriter completes.
            cypher-ink-text applies the SVG ink-distortion filter above. */}
        <h1 className="cypher-ink-text font-mono text-4xl font-bold tracking-[0.02em] md:text-7xl lg:text-8xl overflow-hidden">
          <SpecialText
            inView
            speed={30}
            className="text-4xl md:text-7xl lg:text-8xl"
          >
            The temporal
          </SpecialText>
          <br />
          <span className="inline-block">
            <SpecialText
              inView
              speed={30}
              delay={1.5}
              className="text-4xl md:text-7xl lg:text-8xl"
            >
              identity layer
            </SpecialText>
            <span className="cyan-period-enter text-cyan">.</span>
          </span>
        </h1>

        {/* Cypherpunk frame — subhead + CTAs */}
        <div className="relative mx-auto mt-16 max-w-2xl border border-cyan/30 bg-background/30 px-6 py-9 backdrop-blur-[2px] sm:px-8">
          {/* Corner accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-cyan"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-cyan"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-cyan"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-cyan"
          />

          <p className="text-base leading-relaxed text-foreground/90 md:text-lg">
            Proof of personhood for Solana, verified through behavior over time.
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/verify" className="block w-full sm:w-auto">
              <ShimmerButton className="w-full text-sm font-medium sm:w-auto lg:text-base">
                <span className="flex items-center justify-center gap-2">
                  Try the Demo
                  <TemporalArrow className="h-[14px] w-[28px]" />
                </span>
              </ShimmerButton>
            </Link>
            {/* Build button — solid black in both modes. White text, white border
                (invisible on black in light mode, visible against void-black in dark),
                white inset shine for glass edge, white shine sweep on hover. No
                theme-aware variants — black is the design in both modes. */}
            <Link
              href="/integrate"
              className="
                group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full
                px-6 py-3 text-sm font-medium
                transition-all
                sm:inline-flex sm:w-auto
                lg:text-base
                bg-black text-white
                border border-white/25 hover:border-white/45
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]
                hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28)]
              "
            >
              {/* Shine sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -inset-x-1/4 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative flex items-center gap-2">
                Build With Entros
                <TemporalArrow className="h-[14px] w-[28px]" />
              </span>
            </Link>
          </div>
        </div>

        {/* Stat row — stacks vertically on mobile (no dots), single row on md+ (cyan dots).
            Subtle frosted-glass plate lifts the metrics above the animated dot grid. */}
        <div className="mt-12 inline-flex flex-col items-center gap-2 rounded-full bg-background/40 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-foreground backdrop-blur-md md:flex-row md:flex-wrap md:justify-center md:gap-x-5 md:gap-y-2 md:px-8 md:text-base">
          <span>14,000+ attacks</span>
          <span aria-hidden="true" className="hidden text-cyan md:inline">·</span>
          <span>ZK-proven</span>
          <span aria-hidden="true" className="hidden text-cyan md:inline">·</span>
          <span>3 programs</span>
          <span aria-hidden="true" className="hidden text-cyan md:inline">·</span>
          <span>open protocol</span>
        </div>
      </div>
    </section>
  );
}
