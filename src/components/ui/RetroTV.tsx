"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  image: string;
  video?: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** mm:ss counter that runs while mounted — sells the screen as a live feed. */
function useRecTimecode() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * A CSS/SVG console TV: wood-tone case, speaker grille, twin dials, and a
 * screen that plays a photo or looped clip. The footage itself stays sharp —
 * only thin overlays (scanlines, vignette, a flicker pass) sell the "90s set"
 * read, so the subject is never actually degraded.
 */
export default function RetroTV({ image, video, alt, className, priority }: Props) {
  const reduced = useReducedMotion();
  const timecode = useRecTimecode();

  return (
    <div className={cn("relative aspect-[1.618/1] w-full max-w-[26rem]", className)}>
      {/* Case */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(12,12,14,0.55)]"
        style={{
          background:
            "linear-gradient(150deg, #7a5539 0%, #92663f 30%, #5f3f28 68%, #3f2a1b 100%)",
        }}
      />
      {/* Wood grain */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.25' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Rim light */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10"
      />

      <div className="absolute inset-0 flex items-stretch gap-2.5 p-3 sm:gap-3 sm:p-4">
        {/* ---------------- Screen ---------------- */}
        <div className="relative flex-[0.618]">
          <div className="absolute inset-0 rounded-[1.25rem] bg-[#161009] shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]" />
          <div className="absolute inset-[9px] overflow-hidden rounded-[0.85rem] bg-black sm:inset-[11px]">
            {/* Slow continuous drift — a still photo alone reads as a photo; a frame that's always
                almost imperceptibly moving reads as a live feed. */}
            <motion.div
              className="absolute inset-[-4%] [filter:saturate(1.18)_contrast(1.08)_brightness(1.03)]"
              animate={
                reduced
                  ? undefined
                  : { scale: [1.06, 1.13, 1.06], x: ["0%", "-1.5%", "0%"], y: ["0%", "1%", "0%"] }
              }
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            >
              {video ? (
                <video
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <Image
                  src={image}
                  alt={alt}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 70vw, 26rem"
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </motion.div>

            {/* Scanlines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)",
              }}
            />

            {/* REC indicator — a blinking dot plus a live timecode is the fastest visual cue for "footage" */}
            <div className="pointer-events-none absolute left-2 top-2 flex items-center gap-1.5 rounded-sm bg-black/35 px-1.5 py-1 backdrop-blur-[1px]">
              <motion.span
                aria-hidden
                className="size-1.5 rounded-full bg-lime"
                animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.51, 1] }}
              />
              <span className="font-mono text-[8px] tracking-[0.1em] text-white/85 sm:text-[9px]">
                REC {timecode}
              </span>
            </div>

            {/* Vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            {/* Glass sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 22%, transparent 45%)",
              }}
            />

            {/* CRT flicker + roll bar */}
            {!reduced && (
              <>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-white mix-blend-overlay"
                  animate={{ opacity: [0, 0.1, 0.02, 0.14, 0, 0.06, 0] }}
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.08, 0.22, 0.4, 0.55, 0.8, 1],
                  }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-10 opacity-[0.07] blur-[2px]"
                  style={{ background: "linear-gradient(white, transparent)" }}
                  animate={{ top: ["-15%", "115%"] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                />
              </>
            )}
          </div>
        </div>

        {/* ---------------- Controls ---------------- */}
        <div className="flex flex-[0.382] flex-col items-center justify-between gap-2 py-1">
          {/* Speaker grille */}
          <div className="flex h-full w-full gap-[3px] rounded-md bg-black/25 p-1.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] sm:gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="flex-1 rounded-full bg-black/45" />
            ))}
          </div>

          {/* Dials */}
          <div className="flex shrink-0 gap-2">
            <Knob />
            <Knob />
          </div>

          {/* Power LED */}
          <span className="relative flex size-2 shrink-0 items-center justify-center">
            <motion.span
              className="absolute size-2 rounded-full bg-lime"
              animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function Knob() {
  return (
    <span className="relative flex size-4 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c9a876,#6b4a2f)] shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:size-5">
      <span className="absolute h-[6px] w-px bg-black/60 sm:h-[7px]" />
    </span>
  );
}
