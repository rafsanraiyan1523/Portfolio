"use client";

import { motion, useReducedMotion } from "motion/react";

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
 * Pinned-note style step cards, laid out side by side rather than the
 * scattered/overlapping board a "how it works" section usually goes for —
 * every step's full detail is visible at once, in one row on desktop and
 * one column on mobile, connected by a single animated dashed thread
 * instead of a hand-tuned zigzag path.
 */
export default function HowItWorks({ steps, className }: HowItWorksProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      {steps.length > 1 && (
        <svg
          aria-hidden
          className="absolute inset-x-0 top-[34px] hidden h-px w-full lg:block"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="8%"
            x2="92%"
            y1="0.5"
            y2="0.5"
            stroke="currentColor"
            className="text-ink/15"
            strokeWidth="1.5"
            strokeDasharray="7 7"
            initial={false}
            animate={reduced ? undefined : { strokeDashoffset: -28 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )}

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-5">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={cn(
              "relative transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0 lg:flex-1",
              i % 2 === 0 ? "lg:rotate-2" : "lg:-rotate-2",
            )}
          >
            <div className="rounded-[22px] border border-ink/10 bg-paper p-2 shadow-[0_20px_40px_-24px_rgba(12,12,14,0.35)]">
              <Pin className="mx-auto mb-4 size-6" style={{ color: step.accent }} />
              <div
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border p-4"
                style={{
                  background: `${step.accent}14`,
                  borderColor: `${step.accent}33`,
                }}
              >
                <span
                  className="accent-serif text-4xl italic"
                  style={{ color: step.accent }}
                >
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-tight tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>

                {step.deliverables?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {step.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-ink/12 bg-paper px-2.5 py-1 text-[11px] text-ink/65"
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
