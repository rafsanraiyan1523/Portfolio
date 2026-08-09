"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fixed shard trajectories — a glass pane cracking outward from its centre. */
const SHARDS = [
  { dx: -34, dy: -26, rotate: -70 },
  { dx: 30, dy: -32, rotate: 55 },
  { dx: -42, dy: 8, rotate: -30 },
  { dx: 40, dy: 4, rotate: 40 },
  { dx: -18, dy: 32, rotate: -95 },
  { dx: 20, dy: 30, rotate: 80 },
  { dx: 2, dy: -38, rotate: 15 },
] as const;

type Props = {
  items: readonly string[];
  startIndex?: number;
  className?: string;
  ready: boolean;
  delay: number;
  bobDelay: number;
  cycleMs?: number;
};

/**
 * Floating glass pill that cycles through the stack list. Hovering shatters
 * it into shards that fly apart; it reforms a moment later showing the next
 * item, so the full list surfaces over time instead of two fixed labels.
 */
export default function GlassChip({
  items,
  startIndex = 0,
  className,
  ready,
  delay,
  bobDelay,
  cycleMs = 4200,
}: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(startIndex % items.length);
  const [broken, setBroken] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const shatter = () => {
    if (broken) return;
    if (reduced) {
      setIndex((i) => (i + 1) % items.length);
      return;
    }
    setBroken(true);
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % items.length);
      setBroken(false);
    }, 480);
  };

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(shatter, cycleMs);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, cycleMs]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={
        ready
          ? { opacity: 1, scale: 1, y: reduced ? 0 : [10, -6, 10] }
          : { opacity: 0, scale: 0.85, y: 10 }
      }
      transition={
        ready
          ? {
              opacity: { duration: 0.7, delay, ease: EASE },
              scale: { duration: 0.7, delay, ease: EASE },
              y: reduced
                ? { duration: 0.7, delay, ease: EASE }
                : { duration: 4.5, delay: delay + bobDelay, repeat: Infinity, ease: "easeInOut" },
            }
          : { duration: 0.4 }
      }
      onMouseEnter={shatter}
      className={cn("absolute z-10", className)}
    >
      <div className="relative">
        <div
          className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper/80 px-4 py-2 shadow-[0_8px_24px_-8px_rgba(12,12,14,0.25)] backdrop-blur-md transition-opacity duration-150"
          style={{ opacity: broken ? 0 : 1 }}
        >
          <span className="size-1.5 rounded-full bg-lime-deep" />
          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-ink/80">
            {items[index]}
          </span>
        </div>

        {broken && (
          <div className="pointer-events-none absolute inset-0">
            {SHARDS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 size-2.5 rounded-[3px] border border-ink/15 bg-paper/85 backdrop-blur-md"
                initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 1, rotate: 0 }}
                animate={{
                  x: `calc(-50% + ${s.dx}px)`,
                  y: `calc(-50% + ${s.dy}px)`,
                  opacity: 0,
                  scale: 0.3,
                  rotate: s.rotate,
                }}
                transition={{ duration: 0.48, delay: i * 0.02, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
