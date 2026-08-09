"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { person } from "@/lib/data";

/**
 * Entry curtain: a counter runs 0 → 100 while the page settles, then the
 * panel splits away. Scroll is locked until it finishes so the hero's
 * reveal is never missed. Skipped entirely under reduced motion.
 */
export default function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Under reduced motion the component renders nothing at all, so there's
    // no curtain to dismiss and no scroll to lock.
    if (reduced) return;

    document.documentElement.classList.add("lenis-stopped");

    let raf = 0;
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast start, settles on 100
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 260);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => {
      document.documentElement.classList.remove("lenis-stopped");
      window.dispatchEvent(new Event("preloader:done"));
    }, 700);
    return () => window.clearTimeout(t);
  }, [done]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-ink px-5 py-6 text-paper md:px-10 md:py-10"
          exit={{ y: "-101%" }}
          transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        >
          <motion.div
            className="eyebrow text-paper/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {person.name}
          </motion.div>

          <div className="flex items-end justify-between gap-6">
            <motion.div
              className="max-w-md text-balance text-sm leading-snug text-paper/55 md:text-base"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {person.roles.join(" · ")}
            </motion.div>

            <div
              className="font-mono text-[18vw] leading-[0.8] tracking-tighter md:text-[10vw]"
              aria-hidden
            >
              {String(count).padStart(3, "0")}
            </div>
          </div>

          {/* Progress rule */}
          <motion.div
            className="mt-6 h-px w-full origin-left bg-paper/25"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: count / 100 }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
