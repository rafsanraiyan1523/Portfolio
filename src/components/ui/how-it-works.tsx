"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  deliverables?: readonly string[];
  /** Hex colour tinting the pin, number and inner panel for this card. */
  accent: string;
}

export interface HowItWorksProps {
  steps: readonly HowItWorksStep[];
  className?: string;
}

const Pin = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

/**
 * Pinned-note style step cards, staggered side by side rather than the
 * scattered/overlapping board a "how it works" section usually goes for.
 * The connecting thread is a real SVG path drawn between each pin's
 * measured centre (not a hard-coded angle), so it always lines up whatever
 * the card width or stagger ends up being at the current breakpoint.
 */
export default function HowItWorks({ steps, className }: HowItWorksProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [thread, setThread] = useState<{ d: string; w: number; h: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || steps.length < 2) return;

    const measure = () => {
      // Below `lg` the cards stack in a single column — a "connecting thread"
      // between them doesn't read as anything, so don't bother drawing one.
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setThread(null);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const points = pinRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
      });
      if (points.some((p) => p === null) || containerRect.width === 0) return;

      const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p!.x.toFixed(1)} ${p!.y.toFixed(1)}`).join(" ");
      setThread({ d, w: containerRect.width, h: containerRect.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {thread && (
        <svg
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          width={thread.w}
          height={thread.h}
          viewBox={`0 0 ${thread.w} ${thread.h}`}
        >
          <motion.path
            d={thread.d}
            stroke="currentColor"
            className="text-ink/25"
            strokeWidth="1.5"
            strokeDasharray="7 7"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={reduced ? undefined : { strokeDashoffset: -28 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )}

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={cn(
              "relative transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0 lg:flex-1",
              i % 2 === 0 ? "lg:rotate-2" : "lg:-rotate-2 lg:translate-y-9",
            )}
          >
            <div className="rounded-[20px] border border-ink/10 bg-paper p-1.5 shadow-[0_20px_40px_-24px_rgba(12,12,14,0.35)]">
              <span
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                className="mx-auto mb-2.5 grid size-6 place-items-center"
              >
                <Pin className="size-5" style={{ color: step.accent }} />
              </span>
              <div
                className="relative flex flex-col overflow-hidden rounded-xl border p-3.5"
                style={{
                  background: `${step.accent}14`,
                  borderColor: `${step.accent}33`,
                }}
              >
                <span
                  className="accent-serif text-3xl italic"
                  style={{ color: step.accent }}
                >
                  {step.number}
                </span>
                <h3 className="mt-2 text-base font-semibold leading-tight tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  {step.description}
                </p>

                {step.deliverables?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {step.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-ink/12 bg-paper px-2 py-0.5 text-[10px] text-ink/65"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
