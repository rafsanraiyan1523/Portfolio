"use client";

import { motion, useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * When the words rise:
 * - "view" (default): the first time the line scrolls into view, driven by Motion.
 * - "load": straight away, driven by a CSS keyframe (.anim-in in globals.css).
 *   Use it above the fold: it runs before hydration, in a throttled tab, and with
 *   JavaScript off, so the line can never be stranded at opacity 0.
 */
type Trigger = "view" | "load";

const loadStyle = (delay: number, from: string): CSSProperties =>
  ({ "--delay": `${delay}s`, "--from": from }) as CSSProperties;

/* ---------------- WordsPullUp ---------------- */

/**
 * Each word rises a fraction of an em and fades in, one after another. Words
 * stay real text, so the line reads and wraps like any other heading.
 */
export function WordsPullUp({
  text,
  className,
  showAsterisk = false,
  style,
  delay = 0.1,
  trigger = "view",
}: {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
  /** Seconds before the first word moves. */
  delay?: number;
  trigger?: Trigger;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ").filter(Boolean);

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        const asterisk =
          showAsterisk && isLast ? (
            <span aria-hidden className="absolute -right-[0.3em] top-[0.62em] text-[0.31em] leading-none">
              *
            </span>
          ) : null;
        const gap = { marginRight: isLast ? 0 : "0.25em" };

        if (trigger === "load") {
          return (
            <span
              key={`${word}-${i}`}
              className="anim-in relative inline-block"
              style={{ ...gap, ...loadStyle(delay + i * 0.08, "0.28em") }}
            >
              {word}
              {asterisk}
            </span>
          );
        }

        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: "0.28em", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE }}
            className="relative inline-block"
            style={gap}
          >
            {word}
            {asterisk}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ---------------- WordsPullUpMultiStyle ---------------- */

export interface PullUpSegment {
  text: string;
  className?: string;
}

/** Same pull-up, but each run of words can carry its own class (colour, weight). */
export function WordsPullUpMultiStyle({
  segments,
  className,
  style,
  delay = 0,
  trigger = "view",
}: {
  segments: PullUpSegment[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
  trigger?: Trigger;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)} style={style}>
      {words.map((w, i) => {
        const gap = { marginRight: i === words.length - 1 ? 0 : "0.25em" };
        if (trigger === "load") {
          return (
            <span
              key={`${w.word}-${i}`}
              className={cn("anim-in inline-block", w.className)}
              style={{ ...gap, ...loadStyle(delay + i * 0.08, "20px") }}
            >
              {w.word}
            </span>
          );
        }
        return (
          <motion.span
            key={`${w.word}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: EASE }}
            className={cn("inline-block", w.className)}
            style={gap}
          >
            {w.word}
          </motion.span>
        );
      })}
    </span>
  );
}
