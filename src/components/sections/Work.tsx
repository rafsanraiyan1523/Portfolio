"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { keepHyphens } from "@/lib/typography";

const EASE = [0.16, 1, 0.3, 1] as const;
const groups = ["Web & E-commerce", "Software", "Tools"] as const;
type Filter = "All" | (typeof groups)[number];

export default function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  // Phones get a swipeable row (see the list below); this tracks the card in view.
  const trackRef = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const shown = filter === "All" ? projects : projects.filter((p) => p.group === filter);

  // A new filter starts the row from its first card.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
  }, [filter]);

  const onTrackScroll = () => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const step = first.offsetWidth + 16; // card + gap-4
    const i = Math.round(el.scrollLeft / step);
    setSlide((prev) => (prev === i ? prev : i));
  };

  const chips: { label: Filter; count: number }[] = [
    { label: "All", count: projects.length },
    ...groups.map((g) => ({ label: g, count: projects.filter((p) => p.group === g).length })),
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="shell">
        <SectionHeading
          id="work-title"
          title="Selected work."
          intro="Pick a category to jump straight to the work you care about."
        />

        <div
          role="group"
          aria-label="Filter projects"
          // Phones: one swipeable row of chips. From sm up: centred and wrapping.
          data-lenis-prevent
          className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-auto sm:mt-12 sm:max-w-3xl sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((chip) => {
            const active = filter === chip.label;
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(chip.label)}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-5 text-sm font-medium transition-all duration-300",
                  active
                    ? "border-black bg-black text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)]"
                    : "border-line-strong bg-card text-muted hover:border-ink hover:text-ink",
                )}
              >
                {chip.label}
                <span className={cn("text-xs tabular-nums", active ? "text-white/70" : "text-muted")}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Phones: one swipeable row with the next card peeking in (scroll snap).
            From md up: the two-column grid. It is `relative` so the cards'
            absolutely positioned screen-reader text stays inside the row's
            scroll clip instead of widening the whole page. */}
        <motion.ul
          ref={trackRef}
          layout
          onScroll={onTrackScroll}
          data-lenis-prevent
          aria-label="Projects"
          className="relative -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:mt-16 sm:px-6 md:mx-auto md:grid md:max-w-[72rem] md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:gap-7 [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((project, i) => (
              <motion.li
                key={project.id}
                layout
                // An odd card out on the last row sits centred, not stranded on the left.
                className={cn(
                  "w-[86%] shrink-0 snap-start sm:w-[70%] md:w-auto",
                  shown.length % 2 === 1 &&
                    i === shown.length - 1 &&
                    "md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)] lg:w-[calc(50%-0.875rem)]",
                )}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
              >
                <ProjectCard project={project} priority={i < 2} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Where you are in the row, phones only. */}
        <div className="mt-5 flex items-center justify-center gap-4 md:hidden" aria-hidden="true">
          <div className="flex gap-1.5">
            {shown.map((p, i) => (
              <span
                key={p.id}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === Math.min(slide, shown.length - 1) ? "w-6 bg-ink" : "w-1.5 bg-line-strong",
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium tabular-nums text-muted">
            {Math.min(slide, shown.length - 1) + 1} / {shown.length} · swipe
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const primary = project.links?.[0];
  const [w, h] = project.imageSize;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card transition-shadow duration-500 hover:shadow-[0_30px_60px_-34px_rgba(27,27,27,0.45)]">
      {/* Every screenshot shows whole: it keeps its own shape and sits centred
          on a tint of the project's accent, so nothing is ever cropped. */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${project.accent}2e, ${project.accent}0f 55%, #f1efe9 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center px-5 pb-5 pt-14 sm:px-8 sm:pb-8 sm:pt-16">
          <Image
            src={project.image}
            alt={`${project.name} screenshot`}
            width={w}
            height={h}
            priority={priority}
            sizes="(max-width: 768px) 90vw, 34rem"
            className="h-auto max-h-full w-auto max-w-full rounded-xl shadow-[0_20px_40px_-18px_rgba(27,27,27,0.4)] ring-1 ring-black/5 transition-transform duration-[1.2s] ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015]"
          />
        </div>
        <span className="label absolute left-3 top-3 rounded-full bg-card px-3 py-1.5 text-ink shadow-sm">
          {project.group}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="label text-muted">{project.category}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink">{project.name}</h3>
        <span aria-hidden className="mt-4 block h-px w-10 bg-line-strong" />
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{keepHyphens(project.description)}</p>

        <dl className="mt-6 grid grid-cols-3 gap-1.5 sm:gap-2">
          {project.results.map((r) => (
            <div key={r.label} className="flex flex-col-reverse rounded-xl bg-paper-2/70 px-2.5 py-2.5 sm:px-3 sm:py-3">
              <dt className="mt-1 text-[0.6875rem] leading-tight text-muted sm:text-xs sm:leading-snug">{r.label}</dt>
              <dd className="text-base font-bold tracking-tight text-ink">{r.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-ink/75">
              {tech}
            </li>
          ))}
        </ul>

        {primary ? (
          <div className="mt-auto flex flex-wrap gap-x-5 pt-4">
            {project.links?.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-accent-ink"
              >
                {link.label}
                <span className="sr-only"> for {project.name}</span>
                <Icon
                  name="arrowRight"
                  size={16}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
