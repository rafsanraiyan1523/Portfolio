"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

import { stackMarquee } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Constant camera tilt — looking slightly down on the globe, like the reference. */
const TILT_DEG = 16;
/** Seconds for one full turn. Slow and constant. */
const REVOLUTION_SECONDS = 55;
const NEAR_OPACITY = 1;
const FAR_OPACITY = 0.16;

type Point = {
  label: string;
  x: number;
  y: number;
  z: number;
  /** Base type-scale tier, independent of rotation depth — some words just read bigger. */
  weight: 1 | 2 | 3;
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Smallest stride >= 2 that's coprime with n, so mapping i -> (i*stride)%n visits every slot once. */
function coprimeStride(n: number): number {
  for (let s = Math.max(2, Math.round(n * 0.618)); s < n * 2; s++) {
    if (gcd(s, n) === 1) return s;
  }
  return 1;
}

/**
 * Evenly distributes N points on a unit sphere (golden-angle spiral — no pole
 * clustering). Labels are assigned to sphere "slots" through a coprime-stride
 * permutation rather than in array order — otherwise the first few entries
 * (which also get the largest weight tier below) would all land near the same
 * pole instead of scattered across the globe.
 *
 * `y` is deliberately kept off the exact poles (`(2*slot+1)/n` rather than the
 * more common `slot/(n-1)`), which would otherwise put slot 0 at y = 1 exactly
 * — a point sitting *on* the rotation axis that never appears to move as the
 * sphere spins, which reads as a frozen/broken word rather than a rotating one.
 */
function fibonacciSphere(labels: readonly string[]): Point[] {
  const n = labels.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const stride = coprimeStride(n);

  return labels.map((label, i) => {
    const slot = (i * stride) % n;
    const y = n === 1 ? 0 : 1 - (2 * slot + 1) / n;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * slot;
    const weight: Point["weight"] = i < 4 ? 3 : i < 12 ? 2 : 1;
    return { label, x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, weight };
  });
}

const WEIGHT_CLASS: Record<Point["weight"], string> = {
  3: "text-xl font-medium tracking-tight md:text-2xl",
  2: "text-base font-medium tracking-tight md:text-lg",
  1: "font-mono text-[11px] uppercase tracking-[0.1em] text-muted md:text-xs",
};

/**
 * A slowly, continuously spinning 3D tag cloud of the stack — real CSS 3D
 * (perspective + preserve-3d), not a flat illusion. Each word sits at a fixed
 * point on a sphere; a rotating group carries that position around while each
 * word carries an equal-and-opposite counter-rotation, so it always faces the
 * camera flat and legible (the maths cancel to a pure translation — see the
 * per-frame update below). Depth still fades opacity and the browser's own
 * perspective projection still scales near/far words automatically.
 */
export default function StackSphere({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const points = useMemo(() => fibonacciSphere(stackMarquee), []);

  const sceneRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const angleRef = useRef(0);
  const radiusRef = useRef(150);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const measure = () => {
      radiusRef.current = scene.offsetWidth * 0.42;
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(scene);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const tiltRad = (TILT_DEG * Math.PI) / 180;
    const cosT = Math.cos(tiltRad);
    const sinT = Math.sin(tiltRad);
    const speed = (Math.PI * 2) / REVOLUTION_SECONDS;

    const paint = (angle: number) => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const R = radiusRef.current;

      points.forEach((p, i) => {
        const el = wordRefs.current[i];
        if (!el) return;

        // World-space position: rotateY(angle) around the vertical axis, then
        // a constant rotateX(tilt) camera tilt. Translating a word straight to
        // this final point — with no rotation of its own — is what keeps it
        // flat and legible (billboarded) while still orbiting the sphere; the
        // ancestor's `perspective` scales it by depth automatically.
        const x1 = p.x * cosA + p.z * sinA;
        const z1 = -p.x * sinA + p.z * cosA;
        const y2 = p.y * cosT - z1 * sinT;
        const z2 = p.y * sinT + z1 * cosT;

        const depth = (z2 + 1) / 2; // 0 (far) .. 1 (near)
        const opacity = FAR_OPACITY + depth * (NEAR_OPACITY - FAR_OPACITY);

        el.style.opacity = String(opacity);
        el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * R).toFixed(2)}px, ${(y2 * R).toFixed(2)}px, ${(z2 * R).toFixed(2)}px)`;
      });
    };

    if (reduced) {
      paint(0.4);
      return;
    }

    // The loop only runs while the sphere is actually on screen — otherwise
    // it'd burn a rAF callback every frame for the entire time the page is
    // open, including whenever the visitor has scrolled well past it.
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) angleRef.current += dt * speed;
      paint(angleRef.current);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible === visibleRef.current) return;
        visibleRef.current = nowVisible;

        if (nowVisible) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 },
    );
    if (sceneRef.current) io.observe(sceneRef.current);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [points, reduced]);

  return (
    <div
      ref={sceneRef}
      aria-hidden
      className={cn("relative mx-auto aspect-square w-full max-w-[26rem]", className)}
      style={{ perspective: "900px" }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        className="absolute left-1/2 top-1/2 size-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {points.map((p, i) => (
          <span
            key={p.label}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className={cn(
              "absolute left-0 top-0 origin-center whitespace-nowrap will-change-transform",
              WEIGHT_CLASS[p.weight],
            )}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
