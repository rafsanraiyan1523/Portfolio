"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";

import AmbientOrbs from "@/components/ui/AmbientOrbs";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/data";

/**
 * How the work runs. A vertical rule draws itself down the section as you
 * scroll, tying the four stages together.
 */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });

  return (
    <section id="process" className="grain relative bg-paper py-24 md:py-36">
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
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHeading
              eyebrow="Process"
              segments={[
                { text: "A loop, not a" },
                { text: "handoff.", className: "accent-serif" },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Four stages that feed each other. Optimise sends findings straight
              back into discover — which is where compounding growth comes from.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* Track + progress line */}
          <div
            aria-hidden
            className="absolute left-[0.4375rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-ink/12 md:block"
          />
          <motion.div
            aria-hidden
            className="absolute left-[0.4375rem] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-ink md:block"
            style={{ scaleY: reduced ? 1 : scrollYProgress }}
          />

          <RevealGroup className="space-y-0" stagger={0.12}>
            {process.map((stage) => (
              <RevealItem
                key={stage.step}
                className="group relative border-b border-ink/12 py-8 md:py-12 md:pl-16"
              >
                {/* Node */}
                <span
                  aria-hidden
                  className="absolute left-0 top-[3.6rem] hidden size-3.5 rounded-full border-2 border-paper bg-ink transition-transform duration-500 group-hover:scale-125 md:block"
                />

                <div className="grid gap-5 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-4">
                    <span className="eyebrow text-muted">Step {stage.step}</span>
                    <h3 className="display-sm mt-3">{stage.title}</h3>
                  </div>

                  <p className="text-sm leading-relaxed text-muted md:col-span-5 md:text-base">
                    {stage.blurb}
                  </p>

                  <ul className="flex flex-wrap content-start gap-2 md:col-span-3">
                    {stage.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/65 transition-colors duration-300 group-hover:border-ink/30"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
