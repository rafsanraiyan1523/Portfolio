"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import AmbientOrbs from "@/components/ui/AmbientOrbs";
import { DotPattern } from "@/components/ui/dot-pattern";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * How the work runs. A vertical rule draws itself down the section as you
 * scroll, and each stage lights up in its own accent colour as the line
 * reaches it — the timeline from the original design, rebuilt as a proper
 * card system with real scroll-linked motion instead of a static reveal.
 */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const total = process.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    mass: 0.4,
  });

  return (
    <section
      id="process"
      className="grain relative bg-paper pb-[var(--space-section)] pt-16 md:pb-[var(--space-section-lg)] md:pt-20"
    >
      <DotPattern className="-z-10 fill-ink/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <AmbientOrbs
        orbs={[
          {
            size: "size-[22rem]",
            position: "-left-20 bottom-0",
            color: "191,23,71",
            opacity: 0.16,
            duration: 14,
            delay: 0.8,
            drift: { x: 22, y: -18 },
          },
        ]}
      />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Process"
              segments={[
                { text: "A loop, not a" },
                { text: "handoff.", className: "accent-serif" },
              ]}
            />
          </div>
          <p className="text-base leading-relaxed text-muted lg:pt-20 md:text-lg">
            Four stages that feed each other. Optimise sends findings straight
            back into discover — which is where compounding growth comes from.
          </p>
        </div>

        <div ref={ref} className="relative mt-flow space-y-5 md:space-y-6">
          {/* Track + progress line */}
          <div
            aria-hidden
            className="absolute left-[1.1875rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-ink/12 md:block"
          />
          <motion.div
            aria-hidden
            className="absolute left-[1.1875rem] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-ink md:block"
            style={{ scaleY: reduced ? 1 : progress }}
          />

          {process.map((stage, i) => (
            <StageCard
              key={stage.step}
              stage={stage}
              index={i}
              total={total}
              progress={progress}
              reduced={Boolean(reduced)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({
  stage,
  index,
  total,
  progress,
  reduced,
}: {
  stage: (typeof process)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Roughly where this stage sits along the shared track — same
  // fraction-of-total approximation the stacking deck uses elsewhere,
  // since real per-card pixel measurement isn't worth it for a smooth fade.
  const threshold = (index + 0.5) / total;
  const activation = useTransform(progress, [threshold - 0.12, threshold + 0.04], [0, 1]);
  const nodeScale = useTransform(activation, [0, 1], [1, 1.35]);
  // Motion's colour interpolation needs a literal value, not a CSS var()
  // reference — this is the site's --color-ink hex from globals.css.
  const nodeColor = useTransform(activation, [0, 1], ["#0c0c0e", stage.accent]);
  const glow = useTransform(activation, [0, 1], [0, 1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: reduced ? 0 : index * 0.05, ease: EASE }}
      className="group relative md:pl-16"
    >
      {/* Node — fills with the stage's own accent as the line reaches it */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-8 hidden size-3.5 rounded-full border-2 border-paper bg-ink md:block"
        style={{
          scale: reduced ? 1 : nodeScale,
          backgroundColor: reduced ? stage.accent : nodeColor,
        }}
      />
      <motion.span
        aria-hidden
        className="absolute left-0 top-8 hidden size-3.5 rounded-full md:block"
        style={{
          opacity: reduced ? 0 : glow,
          boxShadow: `0 0 0 6px ${stage.accent}33, 0 0 16px 4px ${stage.accent}55`,
        }}
      />

      <div
        className="relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-2/50 p-6 shadow-[0_1px_2px_rgba(12,12,14,0.03)] transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:bg-paper-2 hover:shadow-[0_24px_48px_-28px_rgba(12,12,14,0.35)] md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 140% at 0% 0%, ${stage.accent}1c, transparent 60%)`,
          }}
        />

        <div className="relative grid gap-5 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <span
              className="eyebrow"
              style={{ color: stage.accent }}
            >
              Step {stage.step}
            </span>
            <h3 className="display-sm mt-3">{stage.title}</h3>
          </div>

          <p className="text-sm leading-relaxed text-muted md:col-span-5 md:text-base">
            {stage.blurb}
          </p>

          <ul className="flex flex-wrap content-start gap-2 md:col-span-3">
            {stage.deliverables.map((item, pi) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.5,
                  delay: reduced ? 0 : 0.15 + pi * 0.07,
                  ease: EASE,
                }}
                className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/65 transition-colors duration-300 group-hover:border-ink/30"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
