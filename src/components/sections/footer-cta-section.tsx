import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function FooterCTASection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <hr className="mx-auto mb-16 w-24 border-t border-foreground/[0.06]" />
      <p className="font-mono text-xl tracking-[0.02em] text-foreground md:text-2xl">
        The future of identity is temporal, not static.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/technology">
          <ShimmerButton className="text-sm font-medium lg:text-base">
            <span className="flex items-center gap-2">
              How It Works
              <span aria-hidden="true">→</span>
            </span>
          </ShimmerButton>
        </Link>
      </div>
    </section>
  );
}
