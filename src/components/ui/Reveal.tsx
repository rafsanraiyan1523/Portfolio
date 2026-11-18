"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Rise + fade, once, when the element scrolls into view. It starts
 * partly visible so nothing ever reads as missing while it waits.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={className}
      // Opacity and transform only: both run on the compositor, so a section
      // entering never forces a repaint (an animated blur filter would).
      initial={{ opacity: 0.25, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduced ? { duration: 0 } : { duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
