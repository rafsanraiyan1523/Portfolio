"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Selected work as a coverflow gallery.
 *
 * Drag, click a side card, or use the arrow keys to bring a project to
 * centre stage; the description panel below tracks whichever project is
 * centred, so the copy always matches the cover in front of you.
 */
export default function Work() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section id="work" className="section-t grain relative bg-paper-2">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Selected work"
              segments={[
                { text: "Seven builds," },
                { text: "shipped", className: "accent-serif" },
                { text: "and measured." },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              From a live production storefront to hand-rolled Laravel systems.
              Each one shipped end to end — schema, interface, deployment.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-flow">
        <CoverflowCarousel
          slides={projects.map((p) => ({
            src: p.image,
            alt: `${p.name} interface`,
            title: p.name,
            accent: p.accent,
          }))}
          activeIndex={active}
          onActiveChange={setActive}
          cardWidth="clamp(200px, 30vw, 400px)"
          focusScale={1.08}
          showNavigation
          showPagination
          label="Selected work"
        />

        <div className="container-x">
          <div className="mx-auto mt-2 max-w-4xl md:mt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink"
                    style={{ background: project.accent }}
                  >
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.14em] text-muted">
                    {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="display-md mt-2">{project.name}</h3>
                <p className="mt-1 text-lg tracking-tight text-ink/70 md:text-xl">
                  {project.tagline}
                </p>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                  {project.description}
                </p>

                <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/12 pt-4">
                  {project.results.map((result) => (
                    <div key={result.label}>
                      <dt className="sr-only">{result.label}</dt>
                      <dd>
                        <span className="block text-2xl font-medium tracking-tight md:text-3xl">
                          {result.value}
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                          {result.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/65"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.links?.length ? (
                  <div className="mt-5 flex flex-wrap gap-5">
                    {project.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="label"
                        data-cursor-label="Open"
                        className="link-underline inline-flex items-center gap-2 text-sm font-medium text-ink"
                      >
                        {link.label}
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
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
