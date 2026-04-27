"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

/**
 * Hover/click navigation dropdown.
 *
 * - 340px panel; each row carries a label + optional one-line description.
 * - Hover-triggered with a 150ms delay before close (forgiving when
 *   the cursor briefly leaves the panel boundary).
 * - Click on the trigger toggles open (touch / a11y).
 * - Escape closes; clicks outside close.
 * - Animated entry: opacity + 4px slide-in.
 */
export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: DropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleEnter = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        className="inline-flex items-center gap-1 py-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground"
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-foreground/40 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Panel: a small invisible bridge above the panel keeps hover
          alive when the cursor crosses the gap from trigger to panel. */}
      <div
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-3",
          "transition-[opacity,transform] duration-150",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <div className="w-[340px] border border-border bg-surface p-1.5 shadow-2xl shadow-black/30">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group block px-3 py-2.5 transition-colors hover:bg-foreground/5"
            >
              <div className="text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
                {item.label}
              </div>
              {item.description && (
                <div className="mt-0.5 text-xs leading-relaxed text-foreground/55">
                  {item.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
