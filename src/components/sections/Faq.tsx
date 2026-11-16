"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";
import { keepHyphens } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-paper-2/60">
      <div className="shell">
        <SectionHeading id="faq-title" title="Questions, answered." />

        <ul className="mx-auto mt-12 grid max-w-3xl gap-3 sm:mt-16">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={cn("card overflow-hidden transition-shadow duration-500", isOpen && "shadow-[0_24px_48px_-34px_rgba(27,27,27,0.4)]")}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-ink sm:px-7 sm:py-6 sm:text-lg"
                  >
                    {item.q}
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-500",
                        isOpen ? "rotate-45 bg-black text-white" : "bg-paper-2 text-ink",
                      )}
                    >
                      <Icon name="plus" size={16} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="max-w-[65ch] px-6 pb-6 text-[0.9375rem] leading-relaxed text-muted sm:px-7 sm:pb-7">
                        {keepHyphens(item.a)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
