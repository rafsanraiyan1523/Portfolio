"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal marquee.
 *
 * The track holds two identical copies of the content and translates by -50%,
 * so the loop is seamless. Pure CSS animation — no rAF cost, and it pauses
 * automatically under prefers-reduced-motion (see globals.css).
 */
export default function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = false,
  className,
  fade = true,
}: {
  children: ReactNode;
  /** Seconds for one full cycle — higher is slower. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  /** Soft mask at both edges. */
  fade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        className,
      )}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "marquee-track flex w-max shrink-0 items-center will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{ ["--marquee-duration" as string]: `${speed}s` }}
      >
        <div className="flex shrink-0 items-center" aria-hidden={false}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
