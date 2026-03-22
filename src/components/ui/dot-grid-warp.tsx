"use client";

/**
 * Interactive dot grid with cursor-driven warp displacement.
 * Preserved experimental hero background — not currently in use.
 * To restore: import { DotGridWarp } from "@/components/ui/dot-grid-warp"
 * and replace FallingPattern in hero-section.tsx.
 */

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DotColors {
  dot: [number, number, number];
  baseAlpha: number;
}

function getColors(): DotColors {
  const isDark = document.documentElement.classList.contains("dark");
  return isDark
    ? { dot: [232, 230, 224], baseAlpha: 0.25 }
    : { dot: [26, 26, 31], baseAlpha: 0.15 };
}

const GAP = 24;
const DOT_RADIUS = 1.2;
const WARP_RADIUS = 450;
const WARP_STRENGTH = 25;
const LERP_SPEED = 0.07;
const SETTLE_THRESHOLD = 0.5;

export function DotGridWarp({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef({ x: -1000, y: -1000 });
  const smoothRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const colorsRef = useRef<DotColors | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Lerp smooth position toward target
    const tx = targetRef.current.x;
    const ty = targetRef.current.y;
    const sx = smoothRef.current.x;
    const sy = smoothRef.current.y;
    smoothRef.current.x = sx + (tx - sx) * LERP_SPEED;
    smoothRef.current.y = sy + (ty - sy) * LERP_SPEED;

    if (!colorsRef.current) colorsRef.current = getColors();
    const { dot: [dr, dg, db], baseAlpha } = colorsRef.current;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    const gap = GAP * dpr;
    const baseR = DOT_RADIUS * dpr;
    const warpR = WARP_RADIUS * dpr;
    const warpRSq = warpR * warpR;
    const warpS = WARP_STRENGTH * dpr;
    const mx = smoothRef.current.x * dpr;
    const my = smoothRef.current.y * dpr;
    const hasPointer = mx > -500;

    ctx.clearRect(0, 0, w, h);

    // Batch static dots
    ctx.fillStyle = `rgba(${dr},${dg},${db},${baseAlpha})`;
    ctx.beginPath();

    const warped: { x: number; y: number; r: number; a: number }[] = [];

    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        if (hasPointer) {
          const dx = x - mx;
          const dy = y - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < warpRSq) {
            const dist = Math.sqrt(distSq);
            const t = dist / warpR;
            // Smooth hermite — strong center, very long gentle tail
            const eased = 1 - t * t * (3 - 2 * t);
            const push = eased * warpS;
            const angle = Math.atan2(dy, dx);

            warped.push({
              x: x + Math.cos(angle) * push,
              y: y + Math.sin(angle) * push,
              // Dots shrink and dim slightly in the warp zone
              r: baseR * (1 - eased * 0.2),
              a: baseAlpha * (1 - eased * 0.3),
            });
            continue;
          }
        }

        ctx.rect(x - baseR, y - baseR, baseR * 2, baseR * 2);
      }
    }

    ctx.fill();

    // Draw warped dots individually
    for (const d of warped) {
      ctx.fillStyle = `rgba(${dr},${dg},${db},${d.a})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Continue the loop until smooth position settles on target
    const dx = smoothRef.current.x - targetRef.current.x;
    const dy = smoothRef.current.y - targetRef.current.y;
    if (dx * dx + dy * dy > SETTLE_THRESHOLD * SETTLE_THRESHOLD) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      runningRef.current = false;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      colorsRef.current = getColors();
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      draw();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      startLoop();
    };

    const onPointerLeave = () => {
      targetRef.current = { x: -1000, y: -1000 };
      startLoop();
    };

    const themeObserver = new MutationObserver(() => {
      colorsRef.current = getColors();
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      cancelAnimationFrame(rafRef.current);
      themeObserver.disconnect();
    };
  }, [draw, startLoop]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div className="hero-glow" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
