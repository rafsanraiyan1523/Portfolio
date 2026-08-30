"use client";

import Link from "next/link";

import AmbientOrbs from "@/components/ui/AmbientOrbs";
import { DotPattern } from "@/components/ui/dot-pattern";
import GoldenSpiral from "@/components/ui/GoldenSpiral";
import Reveal, { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  additional,
  credentials,
  education,
  person,
  summaryLong,
} from "@/lib/data";

/** Bio, education, research and credentials — the CV's back half. */
export default function About() {
  return (
    <section id="about" className="section-y grain relative overflow-hidden bg-paper">
      <DotPattern className="-z-10 fill-ink/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <AmbientOrbs />
      <GoldenSpiral className="pointer-events-none absolute -right-24 top-1/2 -z-10 hidden h-[38rem] w-[38rem] -translate-y-1/2 text-ink/[0.06] lg:block" />
      <div className="container-x">
        <SectionHeading
          eyebrow="About"
          segments={[
            { text: "Dhaka-based," },
            { text: "open", className: "accent-serif" },
            { text: "anywhere.", className: "accent-serif" },
          ]}
        />

        <div className="mt-flow grid gap-16 lg:grid-cols-[1fr_1.618fr] lg:gap-16">
          {/* ---------------- Bio ---------------- */}
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed tracking-tight md:text-xl">
                {summaryLong}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted">
                I work {person.timezoneLabel} out of {person.location}, and spent
                a year running BD–UK async delivery at Quantanite — so
                distributed teams and overlapping-window handoffs are normal
                operating mode, not an adjustment.
              </p>
            </Reveal>

            {/* Quick facts */}
            <RevealGroup
              as="dl"
              className="mt-10 space-y-px overflow-hidden rounded-2xl border border-ink/12 bg-ink/10"
            >
              <Fact label="Languages">
                {additional.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}
              </Fact>
              <Fact label="Memberships">{additional.memberships.join(" · ")}</Fact>
              <Fact label="Activities">{additional.activities.join(" · ")}</Fact>
              <Fact label="Availability">
                {person.availability} · {person.timezoneLabel}
              </Fact>
            </RevealGroup>
          </div>

          {/* ---------------- Education & credentials ---------------- */}
          <div>
            {/* Research & certification */}
            <Reveal>
              <h3 className="eyebrow text-muted">Research &amp; certification</h3>
            </Reveal>

            <RevealGroup className="mt-6 space-y-4" stagger={0.1}>
              {credentials.map((item) => (
                <RevealItem key={item.title}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="label"
                    data-cursor-label="View"
                    className="group block rounded-2xl border border-ink/12 bg-paper-2/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ink/25 hover:bg-paper-2 md:p-7"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper">
                        {item.tag}
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.12em] text-muted">
                        {item.period}
                      </span>
                      <span className="ml-auto font-mono text-[11px] tracking-[0.12em] text-muted">
                        {item.issuer}
                      </span>
                    </div>

                    <h4 className="mt-4 text-lg font-medium leading-snug tracking-tight md:text-xl">
                      {item.title}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.detail}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      <span className="link-underline">View document</span>
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="size-3.5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                      >
                        <path
                          d="M3 13L13 3M13 3H5.5M13 3V10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Education */}
            <Reveal className="mt-14">
              <h3 className="eyebrow text-muted">Education</h3>
            </Reveal>

            <RevealGroup className="mt-6 border-t border-ink/12" stagger={0.08}>
              {education.map((item) => (
                <RevealItem
                  key={item.qualification}
                  className="group flex flex-col gap-1 border-b border-ink/12 py-5 md:flex-row md:items-baseline md:gap-6"
                >
                  <span className="font-mono text-[11px] tracking-[0.12em] text-muted md:w-32 md:shrink-0">
                    {item.period}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium tracking-tight transition-colors duration-300 group-hover:text-ink">
                      {item.qualification}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {item.institution} · {item.location}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <RevealItem className="bg-paper px-5 py-4 md:px-6 md:py-5">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed">{children}</dd>
    </RevealItem>
  );
}
