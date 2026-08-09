"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `value` the first time it scrolls into view.
 * Uses an easeOutExpo curve so the number decelerates into its final digit.
 */
export default function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced motion shows the final value directly (see `shown` below).
    if (!inView || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const shown = reduced ? (inView ? value : 0) : display;

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">
        {prefix}
        {shown}
      </span>
      {suffix}
    </span>
  );
}
