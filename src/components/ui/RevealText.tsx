"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type Segment = {
  text: string;
  /** e.g. "accent-serif text-lime" to style a highlighted phrase. */
  className?: string;
};

const wordVariants: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE },
  },
};

/**
 * Masked, word-by-word headline reveal.
 *
 * Each word sits inside an overflow-hidden wrapper and slides up from below
 * the mask, staggered left-to-right. Words remain individually wrappable so
 * the effect survives any viewport width.
 */
export default function RevealText({
  segments,
  as: Tag = "h2",
  className,
  stagger = 0.045,
  delay = 0,
  /** Animate as soon as it's mounted rather than waiting for scroll. */
  immediate = false,
}: {
  segments: readonly Segment[];
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
}) {
  const reduced = useReducedMotion();

  const plain = segments.map((s) => s.text).join(" ");

  if (reduced) {
    return (
      <Tag className={className}>
        {segments.map((segment, i) => (
          <span key={i} className={segment.className}>
            {segment.text}
            {i < segments.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  // Flatten segments into words while remembering which segment each came from.
  const words = segments.flatMap((segment, si) =>
    segment.text.split(" ").map((word) => ({ word, className: segment.className, si })),
  );

  const motionProps = immediate
    ? { initial: "hidden" as const, animate: "show" as const }
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.5 },
      };

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={container}
        {...motionProps}
        aria-hidden
      >
        {words.map(({ word, className: wc }, i) => (
          <span
            key={`${word}-${i}`}
            /* mr provides the inter-word space that inline-block collapses */
            className="reveal-mask mr-[0.25em] inline-block align-bottom"
          >
            <motion.span
              className={cn("inline-block", wc)}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
      {/* Accessible copy — the animated layer above is aria-hidden */}
      <span className="sr-only">{plain}</span>
    </Tag>
  );
}
