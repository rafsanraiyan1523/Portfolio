"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import Counter from "@/components/ui/Counter";
import { DotPattern } from "@/components/ui/dot-pattern";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { metrics, summaryLong } from "@/lib/data";

/**
 * Dark "results" band — the numbers that justify everything else on the page.
 * Count-ups fire once, on entry.
 */
export default function Impact() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      id="impact"
      className="section-y on-dark relative overflow-hidden bg-ink text-paper"
    >
      <DotPattern className="-z-10 fill-paper/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      {/* Drifting radial wash */}
      <motion.div
        aria-hidden
        style={{ y: reduced ? 0 : bgY }}
        className="pointer-events-none absolute inset-x-0 -top-1/4 h-[150%] opacity-40"
      >
        <div
          className="absolute left-1/2 top-1/2 size-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(191,23,71,0.30) 0%, rgba(191,23,71,0) 70%)",
          }}
        />
      </motion.div>

      <div className="container-x relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.618fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              dark
              eyebrow="Measured impact"
              segments={[
                { text: "Design and code are the" },
                { text: "means.", className: "accent-serif text-lime" },
                { text: "Revenue is the" },
                { text: "measure.", className: "accent-serif text-lime" },
              ]}
              headingClassName="text-paper"
            />
          </div>

          <Reveal delay={0.15} className="lg:pt-24">
            <p className="text-base leading-relaxed text-paper/60 md:text-lg">
              {summaryLong}
            </p>
          </Reveal>
        </div>

        {/* Metric grid */}
        <RevealGroup
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-paper/12 bg-paper/12 sm:grid-cols-2 lg:grid-cols-4 md:mt-24"
          stagger={0.1}
        >
          {metrics.map((metric) => (
            <RevealItem
              key={metric.label}
              className="group relative bg-ink px-6 py-9 transition-colors duration-500 hover:bg-ink-2 md:px-8 md:py-12"
            >
              {/* Hover accent bar */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <div className="flex items-baseline text-lime">
                <Counter
                  value={metric.value}
                  prefix="+"
                  suffix={metric.suffix}
                  className="text-[3.25rem] font-medium leading-none tracking-tighter md:text-[4.25rem]"
                />
              </div>
              <p className="mt-5 text-lg font-medium tracking-tight md:text-xl">
                {metric.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-paper/45">
                {metric.detail}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/35">
            Measured at Go Go Gorgeous — live production store, 2025 to present
          </p>
        </Reveal>
      </div>
    </section>
  );
}
