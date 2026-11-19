"use client";

import { useState } from "react";

import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { experience, metrics, person } from "@/lib/data";
import { cn } from "@/lib/utils";
import { keepHyphens } from "@/lib/typography";

const VISIBLE = 2;

export default function Experience() {
  const current = experience.find((job) => job.current);
  const headline = metrics[0];
  const focus: readonly string[] = current && "focus" in current ? current.focus : [];

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y">
      <div className="shell">
        <SectionHeading
          id="experience-title"
          title="Where I have shipped."
          intro="Four roles across e-commerce, data and engineering, each one feeding the next."
        />

        <div className="mt-14 grid gap-10 sm:mt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 [&>*]:min-w-0">
          {/* ---------------- Timeline ---------------- */}
          <ol className="relative">
            <span aria-hidden className="absolute bottom-8 left-5 top-8 w-px bg-line-strong" />
            {experience.map((job, i) => (
              <li key={job.company} className="relative pb-5 pl-12 last:pb-0 sm:pb-6 sm:pl-16">
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-5 grid size-10 place-items-center rounded-full text-[0.75rem] font-bold",
                    job.current ? "bg-accent text-white ring-4 ring-accent-soft" : "bg-black text-white",
                  )}
                >
                  ’{job.start.slice(2)}
                </span>
                <Reveal delay={i * 0.05}>
                  <JobCard job={job} />
                </Reveal>
              </li>
            ))}
          </ol>

          {/* ---------------- Now panel ---------------- */}
          {/* The "right now" panel repeats the current job card, so phones skip it. */}
          {current ? (
            <div className="hidden lg:block">
              <Reveal className="lg:sticky lg:top-28">
                <div className="rounded-[2rem] bg-gradient-to-br from-sky to-sky-2 p-5 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-black text-[0.6875rem] font-bold text-white">
                      {person.initials}
                    </span>
                    <p className="text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-ink">Right now</p>
                    <span className="ml-auto inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink/70">
                      <span className="relative flex size-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                        <span className="relative size-2 rounded-full bg-accent" />
                      </span>
                      Live
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-26px_rgba(27,40,80,0.45)] sm:p-6">
                    <p className="label text-muted">Current role</p>
                    <p className="mt-2.5 text-lg font-semibold leading-snug text-ink">
                      {current.role} at {current.company}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{keepHyphens(current.highlights[0])}</p>
                  </div>

                  <ul className="mt-3 grid grid-cols-2 gap-3">
                    {focus.map((item) => (
                      <li key={item} className="rounded-2xl bg-white/70 px-4 py-4">
                        <Icon name="check" size={16} className="text-accent-ink" />
                        <p className="mt-2 text-sm font-semibold text-ink">{item}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 rounded-2xl bg-ink p-5 text-white sm:mt-16">
                    <div className="flex items-center justify-between">
                      <p className="label text-white/70">Last role, best result</p>
                      <Icon name="trend" size={16} className="text-accent-glow" />
                    </div>
                    <div
                      className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                      role="img"
                      aria-label={`${headline.value}${headline.suffix} ${headline.label.toLowerCase()}`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-ink to-accent-glow"
                        style={{ width: `${headline.value}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-white/75">
                      +{headline.value}
                      {headline.suffix} {headline.label.toLowerCase()} at Go Go Gorgeous
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function JobCard({ job }: { job: (typeof experience)[number] }) {
  const [open, setOpen] = useState(false);
  const extra = job.highlights.length - VISIBLE;
  const shown = open ? job.highlights : job.highlights.slice(0, VISIBLE);

  return (
    <article className="card p-5 transition-shadow duration-500 hover:shadow-[0_24px_48px_-32px_rgba(27,27,27,0.4)] sm:p-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">{job.role}</h3>
        {job.current ? (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-ink">
            Current
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-[0.9375rem] font-medium text-ink/80">
        {job.url ? (
          <a href={job.url} target="_blank" rel="noreferrer" className="-my-3 inline-block py-3 hover:text-accent-ink hover:underline">
            {job.company}
          </a>
        ) : (
          job.company
        )}
      </p>
      <p className="mt-1 text-sm text-muted">
        {job.period} · {job.location}
      </p>

      <ul className="mt-5 grid gap-2.5">
        {shown.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            {/* One inline box, so the no-wrap pieces flow as text, not as flex items. */}
            <span>{keepHyphens(point)}</span>
          </li>
        ))}
      </ul>

      {extra > 0 ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent-ink hover:underline"
        >
          <Icon name={open ? "close" : "plus"} size={15} />
          {open ? "Show less" : `${extra} more`}
        </button>
      ) : null}
    </article>
  );
}
