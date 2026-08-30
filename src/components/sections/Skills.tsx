"use client";

import { motion } from "motion/react";

import { DotPattern } from "@/components/ui/dot-pattern";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import StackSphere from "@/components/ui/StackSphere";
import { skills } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Full technical inventory, grouped. Each chip pops in on its own beat. */
export default function Skills() {
  return (
    <section id="skills" className="section-y grain relative overflow-hidden bg-paper-2">
      <DotPattern className="-z-10 fill-ink/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Toolkit"
              segments={[
                { text: "The whole" },
                { text: "stack,", className: "accent-serif" },
                { text: "not just the fun half." },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Everything below is something I&rsquo;ve shipped with in
              production — not a list of things I&rsquo;ve read about.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 md:mt-20">
          <StackSphere />
        </Reveal>

        <div className="mt-4 grid gap-x-12 gap-y-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => (
            <Reveal key={group.group} delay={(gi % 3) * 0.08} amount={0.2}>
              <div className="group">
                <div className="flex items-baseline gap-3 border-b border-ink/12 pb-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight">
                    {group.group}
                  </h3>
                  <motion.span
                    aria-hidden
                    className="ml-auto h-px flex-1 origin-right bg-ink/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: EASE }}
                  />
                </div>

                <RevealGroup
                  className="mt-5 flex flex-wrap gap-2"
                  stagger={0.035}
                  amount={0.2}
                >
                  {group.items.map((item) => (
                    <RevealItem key={item} as="span">
                      <span className="inline-block cursor-default rounded-full border border-ink/12 bg-paper px-3.5 py-2 text-[13px] text-ink/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:bg-ink hover:text-paper">
                        {item}
                      </span>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
