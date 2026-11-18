"use client";

import { useRef, type CSSProperties } from "react";

import Icon, { WhatsAppIcon } from "@/components/ui/Icon";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import { WordsPullUp, WordsPullUpMultiStyle } from "@/components/ui/words-pull-up";
import { experience, heroStats, person, stackMarquee } from "@/lib/data";
import { bookCallHref } from "@/lib/booking";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useResilientVideo } from "@/lib/useResilientVideo";

/** Warm cream for type over the film: softer than white, still high contrast on the scrims. */
const CREAM = "#E1E0CC";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

/** A still frame of the film: shown while it loads, if it fails, and under reduced motion. */
const HERO_POSTER = "/hero-poster.jpg";

/** CSS entrance timing (see .anim-in in globals.css). */
const enter = (delay: number, from = "20px") => ({ "--delay": `${delay}s`, "--from": from }) as CSSProperties;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Full-height film hero: a looping background clip under grain and two
 * legibility scrims, the name hung bottom-right as a giant pull-up wordmark,
 * and the work itself in a copy column that sits on the wordmark's cap line.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const current = experience.find((job) => job.current);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { playing, failed, toggle } = useResilientVideo(videoRef, reduced);

  return (
    <>
      <section id="top" aria-labelledby="hero-name" className="h-[88svh] max-h-[54rem] min-h-[36rem] w-full p-2 sm:p-3">
        <div
          className="relative isolate h-full w-full overflow-hidden rounded-2xl bg-black bg-cover md:rounded-[2rem]"
          style={{ backgroundImage: `url(${HERO_POSTER})`, backgroundPosition: "55% center" }}
        >
          {/* Background film */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            aria-hidden
            tabIndex={-1}
            // Visible from the first paint: until frames arrive it shows its own poster.
            // Hidden only once the film has failed for good, leaving the backdrop poster.
            className={`absolute inset-0 -z-10 size-full object-cover object-[55%_center] ${failed ? "invisible" : ""}`}
            src={HERO_VIDEO}
          />

          {/* Grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1]"
            style={{ backgroundImage: GRAIN, backgroundSize: "220px 220px" }}
          />

          {/* Legibility scrims */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-transparent to-black/75"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/15 to-transparent"
          />

          {/* Pause control: looping motion that runs longer than five seconds needs one. */}
          {failed ? null : (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause background video" : "Play background video"}
              className="absolute right-3 top-[5.25rem] z-20 grid size-10 place-items-center rounded-full border border-white/15 bg-black/55 text-[#E1E0CC] transition-colors hover:bg-black/75 sm:right-5 sm:top-24 lg:top-7"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                </svg>
              )}
            </button>
          )}

          {/* Hero content: the work in one row, a hairline, then the name on a single line. */}
          <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 md:px-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="flex max-w-[34rem] flex-col gap-4">
                <p
                  style={enter(0.35)}
                  className="anim-in inline-flex items-center gap-2.5 self-start rounded-full border border-white/15 bg-black/45 px-3.5 py-1.5 text-xs font-medium text-[#E1E0CC]/85"
                >
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-70" />
                    <span className="relative size-2 rounded-full bg-whatsapp" />
                  </span>
                  {person.availability}
                </p>

                <WordsPullUpMultiStyle
                  trigger="load"
                  delay={0.45}
                  className="text-[1.375rem] font-bold uppercase leading-[1.05] tracking-[-0.03em] sm:text-[1.625rem]"
                  style={{ color: CREAM }}
                  segments={[{ text: "Code. Commerce." }, { text: "Growth.", className: "text-accent-glow" }]}
                />

                <p
                  style={enter(0.6)}
                  className="anim-in max-w-[30rem] text-pretty text-sm leading-[1.6] text-[#E1E0CC]/80 md:text-[15px]"
                >
                  I build fast websites and <span className="whitespace-nowrap">e-commerce</span> stores,
                  then grow them with technical SEO and conversion work.{" "}
                  {current ? `${current.role} at BAPI` : person.title}, with {person.yearsExperience} years
                  shipping production platforms.
                </p>
              </div>

              <div style={enter(0.75)} className="anim-in flex flex-wrap items-center gap-x-5 gap-y-3 lg:shrink-0">
                <a
                  href={bookCallHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Book a call: opens Google Calendar in a new tab"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#E1E0CC] py-1 pl-5 pr-1 text-sm font-semibold text-black transition-[gap] duration-300 hover:gap-4 sm:text-base"
                >
                  Book a call
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-black transition-transform duration-300 group-hover:scale-105">
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="text-[#E1E0CC] transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
                <a
                  href={`https://wa.me/${person.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#E1E0CC] underline-offset-4 hover:underline"
                >
                  <WhatsAppIcon size={18} className="text-whatsapp" />
                  WhatsApp me
                </a>
              </div>
            </div>

            <div aria-hidden className="mt-7 h-px bg-[#E1E0CC]/15 sm:mt-9" />

            {/* The name: one sleek line, wrapping only if a screen is too narrow for it. */}
            <div className="flex items-end justify-between gap-8">
              <h1
                id="hero-name"
                className="min-w-0 pb-[0.26em] pt-[0.08em] text-[11.5vw] font-semibold leading-[0.9] tracking-[-0.05em] lg:text-[min(9.5vw,10rem)]"
                style={{ color: CREAM }}
              >
                <WordsPullUp text={person.name} delay={0.15} trigger="load" />
                <span className="sr-only">, {person.title}</span>
              </h1>
              <p
                style={enter(0.9)}
                className="anim-in hidden shrink-0 pb-[2.2vw] text-right text-xs font-medium uppercase leading-relaxed tracking-[0.14em] text-[#E1E0CC]/60 lg:block"
              >
                {person.location}
                <br />
                {person.timezoneLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stack ticker ---------------- */}
      <div className="mt-14 border-y border-line py-10 sm:mt-20 sm:py-12" aria-label="Tech stack">
        <Marquee speed={55} pauseOnHover>
          {stackMarquee.map((item) => (
            <span
              key={item}
              className="whitespace-nowrap px-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted sm:px-12"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---------------- Stats ---------------- */}
      <div className="shell pb-8 sm:pb-12">
        <dl className="grid grid-cols-2 gap-y-10 py-6 sm:py-10 lg:grid-cols-4">
          {heroStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="flex flex-col-reverse items-center text-center">
              <dt className="label mt-3 text-muted">{stat.label}</dt>
              <dd className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.04em] text-ink">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </>
  );
}
