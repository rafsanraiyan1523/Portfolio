"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import AmbientOrbs from "@/components/ui/AmbientOrbs";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Expanding service rows. Hovering (or focusing) a row lifts it, reveals the
 * detail column and slides an accent panel in behind the number.
 */
export default function Services() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="services" className="section-y grain relative bg-paper">
      <AmbientOrbs
        orbs={[
          {
            size: "size-[24rem]",
            position: "-right-24 top-10",
            color: "191,23,71",
            opacity: 0.18,
            duration: 15,
            drift: { x: -26, y: 22 },
          },
        ]}
      />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="What I do"
              segments={[
                { text: "Four disciplines," },
                { text: "one", className: "accent-serif" },
                { text: "operator.", className: "accent-serif" },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Most teams hand these off between four people. I run them as one
              loop — which is why the numbers move faster.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-ink/12 md:mt-24">
          {services.map((service, i) => {
            const isActive = active === i;

            return (
              <Reveal key={service.id} delay={i * 0.06} amount={0.2}>
                <div
                  className="group relative border-b border-ink/12"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {/* Ink wash that wipes in on hover */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 -z-0 origin-bottom bg-ink"
                    initial={false}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />

                  <button
                    type="button"
                    onClick={() => setActive(isActive ? null : i)}
                    aria-expanded={isActive}
                    data-cursor="hover"
                    className={cn(
                      "relative z-10 flex w-full items-start gap-5 px-1 py-8 text-left transition-colors duration-500 md:gap-10 md:py-12",
                      isActive ? "text-paper" : "text-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 font-mono text-xs tracking-[0.12em] transition-colors duration-500 md:mt-3",
                        isActive ? "text-lime" : "text-muted",
                      )}
                    >
                      {service.number}
                    </span>

                    <div className="flex-1">
                      <h3 className="display-md">{service.title}</h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-6 pt-6 md:grid-cols-2 md:gap-12 md:pt-8">
                              <p className="max-w-md text-sm leading-relaxed text-paper/60 md:text-base">
                                {service.blurb}
                              </p>
                              <ul className="flex flex-wrap content-start gap-2">
                                {service.points.map((point, pi) => (
                                  <motion.li
                                    key={point}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.12 + pi * 0.05,
                                      duration: 0.4,
                                      ease: EASE,
                                    }}
                                    className="rounded-full border border-paper/20 px-3.5 py-1.5 text-xs text-paper/70"
                                  >
                                    {point}
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Chevron */}
                    <span
                      className={cn(
                        "mt-2 grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 md:mt-3 md:size-11",
                        isActive
                          ? "rotate-45 border-lime text-lime"
                          : "border-ink/20 text-ink",
                      )}
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" fill="none" className="size-4">
                        <path
                          d="M8 3v10M3 8h10"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
