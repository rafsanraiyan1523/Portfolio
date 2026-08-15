"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

const PHI = 1.618033988749895;
/** Growth rate such that the radius multiplies by φ every quarter turn — the
 * defining property of a true golden spiral. */
const GROWTH = Math.log(PHI) / (Math.PI / 2);

function buildSpiralPath(turns: number, points: number) {
  const coords: [number, number][] = [];
  const thetaMax = turns * 2 * Math.PI;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * thetaMax;
    const r = Math.exp(GROWTH * theta);
    coords.push([r * Math.cos(theta), r * Math.sin(theta)]);
  }

  return coords;
}

/**
 * A true logarithmic golden spiral (radius × φ every 90°), traced as one
 * continuous SVG path. Plays a slow draw-in once it scrolls into view —
 * a quiet nod to the ratio the whole layout is built on, not just decoration.
 */
export default function GoldenSpiral({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const { d, viewBox } = useMemo(() => {
    const coords = buildSpiralPath(4.25, 240);
    const xs = coords.map(([x]) => x);
    const ys = coords.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = Math.max(maxX - minX, maxY - minY) * 0.04;

    const path = coords
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");

    return {
      d: path,
      viewBox: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`,
    };
  }, []);

  return (
    <svg aria-hidden viewBox={viewBox} className={cn("pointer-events-none", className)} fill="none">
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
        whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.618, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
