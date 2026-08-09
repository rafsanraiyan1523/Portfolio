"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type Orb = {
  size: string;
  position: string;
  color: string;
  opacity?: number;
  duration?: number;
  delay?: number;
  drift?: { x?: number; y?: number };
};

const DEFAULT_ORBS: Orb[] = [
  {
    size: "size-[26rem]",
    position: "-left-32 top-0",
    color: "191,23,71",
    opacity: 0.22,
    duration: 16,
    drift: { x: 30, y: -24 },
  },
  {
    size: "size-[20rem]",
    position: "-right-20 bottom-0",
    color: "191,23,71",
    opacity: 0.16,
    duration: 13,
    delay: 1.5,
    drift: { x: -24, y: 20 },
  },
];

/**
 * Slow-drifting blurred gradient orbs — the ambient "living background" wash
 * used across light sections. Purely decorative, sits behind content via -z-10.
 */
export default function AmbientOrbs({
  orbs = DEFAULT_ORBS,
  className,
}: {
  orbs?: Orb[];
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full blur-[110px]", orb.size, orb.position)}
          style={{
            background: `radial-gradient(circle, rgba(${orb.color},${orb.opacity ?? 0.2}) 0%, rgba(${orb.color},0) 70%)`,
          }}
          animate={
            reduced
              ? undefined
              : {
                  x: [0, orb.drift?.x ?? 20, 0],
                  y: [0, orb.drift?.y ?? -20, 0],
                }
          }
          transition={{
            duration: orb.duration ?? 15,
            delay: orb.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
