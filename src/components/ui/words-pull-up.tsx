"use client";

import { motion, useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- WordsPullUp ---------------- */

/**
 * Each word rises a fraction of an em and fades in, one after another, the
 * first time the line scrolls into view. Words stay real text, so the line
 * reads and wraps like any other heading.
 */
export function WordsPullUp({
  text,
  className,
  showAsterisk = false,
  style,
  delay = 0.1,
}: {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
  /** Seconds before the first word moves. */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ").filter(Boolean);

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: "0.28em", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: EASE }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast ? (
              <span aria-hidden className="absolute -right-[0.3em] top-[0.62em] text-[0.31em] leading-none">
                *
              </span>
            ) : null}
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
}: {
  segments: PullUpSegment[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
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
      {words.map((w, i) => (
        <motion.span
          key={`${w.word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.6, delay: delay + i * 0.08, ease: EASE }}
          className={cn("inline-block", w.className)}
          style={{ marginRight: i === words.length - 1 ? 0 : "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </span>
  );
}
