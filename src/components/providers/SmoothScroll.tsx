"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { MotionConfig, cancelFrame, frame } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Drives Lenis from Motion's rAF loop so scroll-linked animations and the
 * smooth-scroll position are resolved in the same frame (no 1-frame jitter).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        // In-page links glide through Lenis. Lenis already honours each
        // section's scroll-margin-top (globals.css), so no extra offset here.
        anchors: true,
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
