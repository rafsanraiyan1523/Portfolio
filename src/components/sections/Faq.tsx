"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="grain relative bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="FAQ"
                segments={[
                  { text: "Questions," },
                  { text: "answered", className: "accent-serif" },
                  { text: "up front." },
                ]}
                headingClassName="display-md"
              />
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-sm text-base leading-relaxed text-muted">
                  Anything not covered here — just ask. The form below reaches me
                  directly.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-ink/12">
              {faqs.map((faq, i) => {
                const isOpen = open === i;

                return (
                  <Reveal key={faq.q} delay={i * 0.05} amount={0.2}>
                    <div className="border-b border-ink/12">
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          data-cursor="hover"
                          className="group flex w-full items-start gap-5 py-6 text-left md:py-7"
                        >
                          <span className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "flex-1 text-lg font-medium tracking-tight transition-colors duration-300 md:text-xl",
                              isOpen ? "text-ink" : "text-ink/80 group-hover:text-ink",
                            )}
                          >
                            {faq.q}
                          </span>

                          {/* Plus → minus */}
                          <span
                            aria-hidden
                            className={cn(
                              "relative mt-1 grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                              isOpen
                                ? "border-ink bg-ink text-paper"
                                : "border-ink/20 text-ink",
                            )}
                          >
                            <span className="absolute h-px w-3 bg-current" />
                            <span
                              className={cn(
                                "absolute h-3 w-px bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                isOpen ? "scale-y-0" : "scale-y-100",
                              )}
                            />
                          </span>
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-xl pb-7 pl-10 text-sm leading-relaxed text-muted md:text-base">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
