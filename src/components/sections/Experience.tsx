"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { DotPattern } from "@/components/ui/dot-pattern";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { experience } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Career timeline as accordion rows — the current role opens by default. */
export default function Experience() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section
      id="experience"
      className="section-y on-dark relative overflow-hidden bg-ink text-paper"
    >
      <DotPattern className="-z-10 fill-paper/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              dark
              eyebrow="Experience"
              headingClassName="text-paper"
              segments={[
                { text: "Three years," },
                { text: "three", className: "accent-serif text-lime" },
                { text: "very different seats." },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-paper/55 md:text-lg">
              Intern to department head in under three years — engineering,
              analytics and now owning a live commerce P&amp;L.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-paper/15 md:mt-24">
          {experience.map((job, i) => {
            const isOpen = open === i;

            return (
              <Reveal key={job.company} delay={i * 0.08} amount={0.15}>
                <div className="border-b border-paper/15">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    data-cursor="hover"
                    className="group flex w-full items-start gap-4 py-7 text-left md:gap-10 md:py-10"
                  >
                    <span className="mt-2 hidden font-mono text-[11px] tracking-[0.14em] text-paper/40 md:block md:w-40 md:shrink-0">
                      {job.period}
                    </span>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className={cn(
                            "display-sm transition-colors duration-500",
                            isOpen ? "text-lime" : "text-paper group-hover:text-lime",
                          )}
                        >
                          {job.company}
                        </h3>
                        {job.current && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-lime">
                            <span className="size-1.5 animate-pulse rounded-full bg-lime" />
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-paper/60 md:text-base">
                        {job.role}
                      </p>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-paper/35 md:hidden">
                        {job.period}
                      </p>
                    </div>

                    <span
                      aria-hidden
                      className={cn(
                        "mt-1.5 grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 md:size-11",
                        isOpen
                          ? "rotate-180 border-lime text-lime"
                          : "border-paper/25 text-paper/70",
                      )}
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="size-4">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10 md:pl-[12.5rem]">
                          <ul className="space-y-4">
                            {job.highlights.map((point, pi) => (
                              <motion.li
                                key={point}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.1 + pi * 0.06,
                                  duration: 0.5,
                                  ease: EASE,
                                }}
                                className="flex gap-4 text-sm leading-relaxed text-paper/60 md:text-base"
                              >
                                <span
                                  aria-hidden
                                  className="mt-2 block size-1.5 shrink-0 rounded-full bg-lime"
                                />
                                {point}
                              </motion.li>
                            ))}
                          </ul>

                          <div className="mt-7 flex flex-wrap items-center gap-6 text-sm">
                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/35">
                              {job.location}
                            </span>
                            <Link
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="label"
                              data-cursor-label="Visit"
                              className="link-underline inline-flex items-center gap-2 font-medium text-lime"
                            >
                              {job.company}
                              <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                                <path
                                  d="M3 13L13 3M13 3H5.5M13 3V10.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
