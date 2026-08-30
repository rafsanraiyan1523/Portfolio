"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";

import { DotPattern } from "@/components/ui/dot-pattern";
import ProjectScreenshot from "@/components/ui/ProjectScreenshot";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Selected work as a stacking deck.
 *
 * Each card pins to the viewport while the next one slides over it; the card
 * underneath scales down slightly so the stack reads as depth rather than a
 * plain slideshow.
 */
export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="work" className="section-t grain relative bg-paper-2">
      <DotPattern className="-z-10 fill-ink/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Selected work"
              segments={[
                { text: "Eight builds," },
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

      <div ref={containerRef} className="relative mt-flow">
        {projects.map((project, i) => (
          <StackCard
            key={project.id}
            project={project}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
            reduced={Boolean(reduced)}
          />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  project,
  index,
  total,
  progress,
  reduced,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Cards further down the stack end up slightly smaller.
  const targetScale = 1 - (total - index) * 0.028;
  const start = index / total;

  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  // Cards recede by darkening under an overlay — never by going transparent,
  // which would let the cards beneath show through the stack. Dimming only
  // begins once the *next* card has started sliding over this one.
  // Motion compiles scroll-linked ranges to native scroll-timeline offsets,
  // which must stay inside [0,1] — so clamp. The last card is never covered,
  // so its overlay is skipped entirely (see `isLast` below).
  const isLast = index === total - 1;
  const dimStart = Math.min((index + 1) / total, 0.98);
  const dimEnd = Math.min((index + 1.7) / total, 0.99);
  const dim = useTransform(progress, [dimStart, dimEnd], [0, 0.4]);

  const isLight = project.ink !== "#ffffff";
  const baseBackground = isLight ? "#f4f2ec" : "#0c0c0e";

  return (
    <div
      className="sticky top-0 flex min-h-[100svh] items-center justify-center px-4 py-6 md:px-10 md:py-10"
      style={{ paddingTop: `calc(2.5rem + ${index * 14}px)` }}
    >
      <motion.article
        style={{
          background: baseBackground,
          ...(reduced
            ? {}
            : { scale, transformOrigin: "top center", willChange: "transform" }),
        }}
        className="relative w-full max-w-[84rem] overflow-hidden rounded-[1.5rem] border border-ink/10 shadow-[0_30px_90px_-40px_rgba(12,12,14,0.45)] md:rounded-[2rem]"
      >
        {/* Accent wash bled in from the top-left corner */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 0% 0%, ${project.accent}${
              isLight ? "38" : "30"
            }, transparent 62%)`,
          }}
        />

        {/* Recede overlay — darkens this card as the next one slides over it */}
        {!reduced && !isLast && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-ink"
            style={{ opacity: dim }}
          />
        )}

        <div
          className={`relative z-10 grid gap-4 p-4 md:gap-12 md:p-10 lg:grid-cols-2 lg:items-center lg:p-14 ${
            isLight ? "text-ink" : "on-dark text-paper"
          }`}
        >
          {/* ---------- Copy ---------- */}
          <div className="order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink"
                style={{ background: project.accent }}
              >
                {project.category}
              </span>
              <span
                className={`font-mono text-[11px] tracking-[0.14em] ${
                  isLight ? "text-muted" : "text-paper/45"
                }`}
              >
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <h3 className="display-md mt-3 md:mt-6">{project.name}</h3>

            <p
              className={`mt-1.5 text-base tracking-tight md:mt-3 md:text-xl ${
                isLight ? "text-ink/70" : "text-paper/70"
              }`}
            >
              {project.tagline}
            </p>

            <p
              className={`mt-2 line-clamp-3 max-w-lg text-sm leading-relaxed md:mt-5 md:line-clamp-none md:text-base ${
                isLight ? "text-muted" : "text-paper/50"
              }`}
            >
              {project.description}
            </p>

            {/* Results */}
            <dl
              className={`mt-4 grid grid-cols-3 gap-4 border-t pt-4 md:mt-8 md:pt-6 ${
                isLight ? "border-ink/12" : "border-paper/15"
              }`}
            >
              {project.results.map((result) => (
                <div key={result.label}>
                  <dt className="sr-only">{result.label}</dt>
                  <dd>
                    <span className="block text-lg font-medium tracking-tight md:text-3xl">
                      {result.value}
                    </span>
                    <span
                      className={`mt-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] ${
                        isLight ? "text-muted" : "text-paper/45"
                      }`}
                    >
                      {result.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* Stack + links */}
            <div className="mt-4 flex flex-wrap items-center gap-2 md:mt-7">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    isLight
                      ? "border-ink/15 text-ink/65"
                      : "border-paper/20 text-paper/65"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.links?.length ? (
              <div className="mt-4 flex flex-wrap gap-5 md:mt-7">
                {project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="label"
                    data-cursor-label="Open"
                    className={`link-underline inline-flex items-center gap-2 text-sm font-medium ${
                      isLight ? "text-ink" : "text-lime"
                    }`}
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
          </div>

          {/* ---------- Visual ----------
              Comes first on mobile: the sticky card is capped to 100svh and
              clips anything past it, so with a full copy block the image
              — the actual point of a "selected work" card — never fit.
              Leading with it means it's the one thing that's never clipped. */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="order-1 lg:order-2"
          >
            <ProjectScreenshot
              src={project.image}
              size={project.imageSize}
              alt={`${project.name} interface`}
              priority={index < 2}
            />
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}
