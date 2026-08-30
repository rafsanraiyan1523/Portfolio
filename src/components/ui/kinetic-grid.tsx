"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Ripple = { x: number; y: number; start: number };

const LIFESPAN = 1100;
const WARP_RADIUS = 170;
const WARP_STRENGTH = 14;
const RIPPLE_STRENGTH = 10;
const RIPPLE_BAND = 46;

/**
 * A dot grid that warps toward the pointer and ripples outward from a click —
 * a quiet, tactile background layer rather than a centrepiece. Renders on a
 * single canvas (not one DOM node per dot) and only keeps its rAF loop alive
 * while the pointer is over it or a ripple is still decaying, so it costs
 * nothing while idle. Degrades to a static grid under reduced motion.
 */
export default function KineticGrid({
  children,
  className,
  spacing = 34,
  dotColor = "255,255,255",
  dotOpacity = 0.14,
  accentColor = "191,23,71",
}: {
  children?: React.ReactNode;
  className?: string;
  /** Distance between dots, in CSS pixels. */
  spacing?: number;
  /** "r,g,b" for the base grid. */
  dotColor?: string;
  dotOpacity?: number;
  /** "r,g,b" — the warm colour dots pick up near the pointer and ripples. */
  accentColor?: string;
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      draw(0);
    };

    function draw(now: number) {
      const { width, height, dpr } = sizeRef.current;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const ripples = ripplesRef.current;

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          let dx = 0;
          let dy = 0;
          let heat = 0;

          if (!reduced && pointer.active) {
            const px = pointer.x - x;
            const py = pointer.y - y;
            const dist = Math.hypot(px, py);
            if (dist < WARP_RADIUS && dist > 0.01) {
              const pull = (1 - dist / WARP_RADIUS) ** 2;
              dx += (px / dist) * pull * WARP_STRENGTH;
              dy += (py / dist) * pull * WARP_STRENGTH;
              heat = Math.max(heat, pull);
            }
          }

          if (!reduced) {
            for (const r of ripples) {
              const age = now - r.start;
              const radius = (age / LIFESPAN) * Math.max(width, height) * 0.75;
              const dist = Math.hypot(x - r.x, y - r.y);
              const band = 1 - Math.min(Math.abs(dist - radius) / RIPPLE_BAND, 1);
              if (band > 0) {
                const fade = 1 - age / LIFESPAN;
                const push = band * fade;
                const ex = dist === 0 ? 0 : (x - r.x) / dist;
                const ey = dist === 0 ? 0 : (y - r.y) / dist;
                dx += ex * push * RIPPLE_STRENGTH;
                dy += ey * push * RIPPLE_STRENGTH;
                heat = Math.max(heat, push);
              }
            }
          }

          const r = 1 + heat * 1.6;
          ctx!.beginPath();
          ctx!.arc(x + dx, y + dy, r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${dotColor},${dotOpacity + heat * 0.5})`;
          ctx!.fill();
          if (heat > 0.05) {
            ctx!.beginPath();
            ctx!.arc(x + dx, y + dy, r * 1.8, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${accentColor},${heat * 0.22})`;
            ctx!.fill();
          }
        }
      }
    }

    function loop(now: number) {
      draw(now);
      ripplesRef.current = ripplesRef.current.filter((r) => now - r.start < LIFESPAN);
      const shouldRun = pointerRef.current.active || ripplesRef.current.length > 0;
      rafRef.current = shouldRun ? requestAnimationFrame(loop) : null;
    }

    const wake = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const rect = wrap.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
      wake();
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const rect = wrap.getBoundingClientRect();
      ripplesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        start: performance.now(),
      });
      wake();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);

    return () => {
      observer.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, spacing, dotColor, dotOpacity, accentColor]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
