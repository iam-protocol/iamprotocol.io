import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={cn("glass-panel border border-white/20 dark:border-white/[0.08]", className)}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
