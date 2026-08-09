"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";

type CursorState = { variant: "default" | "hover" | "label"; label?: string };

/**
 * Custom cursor. Opt in per element with:
 *   data-cursor="hover"                → enlarged ring
 *   data-cursor="label" data-cursor-label="View"  → filled disc with text
 * Hidden entirely on touch devices and when reduced motion is requested.
 */
export default function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const enabled = finePointer && !reduced;

  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<CursorState>({ variant: "default" });

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 60, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 900, damping: 60, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      if (target instanceof HTMLElement) {
        const variant = target.dataset.cursor as CursorState["variant"];
        setState({ variant, label: target.dataset.cursorLabel });
      } else {
        setState({ variant: "default" });
      }
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isLabel = state.variant === "label" && Boolean(state.label);
  const size = isLabel ? 84 : state.variant === "hover" ? 52 : 14;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[150] hidden mix-blend-difference lg:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-white text-[10px] font-medium uppercase tracking-[0.12em] text-black"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {isLabel && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
