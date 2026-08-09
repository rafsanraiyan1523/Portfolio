"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import Reveal from "@/components/ui/Reveal";
import { navLinks, person } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="on-dark relative bg-ink pb-10 pt-16 text-paper md:pb-12 md:pt-20">
      <div className="container-x">
        <div className="grid gap-12 border-t border-paper/12 pt-12 md:pt-16 lg:grid-cols-12">
          {/* Identity */}
          <div className="lg:col-span-5">
            <Reveal>
              <Link
                href="#top"
                data-cursor="hover"
                className="group inline-flex items-center gap-3"
              >
                <span className="grid size-10 place-items-center rounded-full bg-lime text-xs font-semibold tracking-tight text-paper transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]">
                  {person.initials}
                </span>
                <span className="text-lg font-medium tracking-tight">
                  {person.name}
                </span>
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/45">
                {person.roles.join(" · ")}. Currently {person.title} at Go Go
                Gorgeous, and {person.availability.toLowerCase()}.
              </p>
            </Reveal>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <Reveal delay={0.05}>
              <h2 className="eyebrow text-paper/40">Sections</h2>
              <ul className="mt-5 space-y-2.5">
                {[...navLinks, { label: "Contact", href: "#contact" }].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="link-underline text-sm text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Elsewhere */}
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <h2 className="eyebrow text-paper/40">Elsewhere</h2>
              <ul className="mt-5 space-y-2.5">
                {person.socials.map((social) => (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group inline-flex items-baseline gap-3 text-sm"
                    >
                      <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                        {social.label}
                      </span>
                      <span className="link-underline text-paper/70 transition-colors group-hover:text-lime">
                        {social.handle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-paper/12 pt-6 text-xs text-paper/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {person.name}. Built with Next.js,
            Tailwind CSS and Motion.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <LocalTime />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              data-cursor="hover"
              className="group inline-flex items-center gap-2 transition-colors hover:text-paper"
            >
              Back to top
              <span className="grid size-6 place-items-center rounded-full border border-paper/25 transition-transform duration-500 group-hover:-translate-y-0.5">
                <svg viewBox="0 0 16 16" fill="none" className="size-3">
                  <path
                    d="M8 13V3M8 3L3 8M8 3l5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function formatDhakaTime() {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: person.timezone,
  }).format(new Date());
}

function subscribeToClock(onTick: () => void) {
  const id = window.setInterval(onTick, 30_000);
  return () => window.clearInterval(id);
}

/**
 * Live clock in Rafsan's timezone. Rendered through useSyncExternalStore so
 * the server emits a placeholder and the client takes over on hydration —
 * no mismatch, no cascading render on mount.
 */
function LocalTime() {
  const time = useSyncExternalStore(
    subscribeToClock,
    formatDhakaTime,
    () => null,
  );

  return (
    <span className="inline-flex items-center gap-2 font-mono tracking-[0.1em]">
      <span className="size-1.5 animate-pulse rounded-full bg-lime" />
      {time ? `${time} in Dhaka` : "— in Dhaka"}
    </span>
  );
}
