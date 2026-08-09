"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import GlassChip from "@/components/ui/GlassChip";
import RetroTV from "@/components/ui/RetroTV";
import { usePrefersReducedMotion } from "@/lib/hooks";
import Marquee from "@/components/ui/Marquee";
import RevealText from "@/components/ui/RevealText";
import { heroStats, person, stackMarquee } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Waits for the preloader curtain before the hero plays its entrance. */
function useHeroReady() {
  const prefersReduced = usePrefersReducedMotion();
  const [curtainLifted, setCurtainLifted] = useState(false);

  useEffect(() => {
    // No preloader runs under reduced motion, so there's no event to wait for.
    if (prefersReduced) return;

    const onDone = () => setCurtainLifted(true);
    window.addEventListener("preloader:done", onDone);
    // Fallback in case the event was missed (fast refresh, cached load).
    const t = window.setTimeout(() => setCurtainLifted(true), 2600);

    return () => {
      window.removeEventListener("preloader:done", onDone);
      window.clearTimeout(t);
    };
  }, [prefersReduced]);

  return prefersReduced || curtainLifted;
}

export default function Hero() {
  const ready = useHeroReady();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Gentle parallax + fade as the hero scrolls away.
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const tvY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0]);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      id="top"
      ref={sectionRef}
      className="grain relative min-h-[100svh] overflow-hidden bg-paper pt-32 md:pt-40"
    >
      {/* Ambient background wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[10%] size-[70vw] rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(191,23,71,0.45) 0%, rgba(191,23,71,0) 70%)",
        }}
        animate={reduced ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ opacity }} className="relative z-10">
        <div className="container-x">
          {/* ---------------- Availability pill ---------------- */}
          <motion.div
            {...fadeUp(0.05)}
            className="mb-8 flex justify-center md:mb-10"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-ink/12 bg-paper/60 py-1.5 pl-2 pr-4 backdrop-blur-sm">
              <span className="relative flex size-5 items-center justify-center">
                <span className="absolute size-2 animate-ping rounded-full bg-lime-deep opacity-75" />
                <span className="relative size-2 rounded-full bg-lime-deep" />
              </span>
              <span className="eyebrow inline-block text-ink/70 hover:animate-tv-flicker">
                {person.availability}
              </span>
            </div>
          </motion.div>

          {/* ---------------- Giant wordmark ---------------- */}
          <motion.div style={{ y: wordmarkY }} className="relative text-center">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[42rem] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(191,23,71,0.35) 0%, rgba(191,23,71,0) 70%)",
              }}
              animate={
                reduced ? undefined : { scale: [1, 1.08, 0.96, 1], opacity: [0.5, 0.65, 0.5] }
              }
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />

            <RevealText
              as="span"
              immediate={ready}
              delay={0.15}
              stagger={0.06}
              className="block text-[clamp(3rem,11vw,8.25rem)] font-medium leading-[0.86] tracking-[-0.03em] text-ink hover:animate-tv-flicker"
              segments={[{ text: person.firstName.toUpperCase() }]}
            />
            <RevealText
              as="span"
              immediate={ready}
              delay={0.28}
              stagger={0.06}
              className="accent-serif -mt-2 block text-[clamp(3.25rem,12vw,9rem)] italic leading-[0.86] tracking-[-0.01em] text-lime-deep hover:animate-tv-flicker md:-mt-4"
              segments={[{ text: person.name.split(" ").slice(1).join(" ") }]}
            />
          </motion.div>

          {/* ---------------- TV + caption row ---------------- */}
          <div className="mt-14 grid grid-cols-1 items-center gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
            <motion.div
              style={{ y: tvY }}
              className="relative lg:col-span-6"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
              transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
            >
              <div className="relative mx-auto max-w-[24rem] lg:mx-0">
                <RetroTV
                  image={person.photo}
                  video={person.heroVideo || undefined}
                  alt={`Portrait of ${person.name}`}
                  priority
                />

                <RotatingBadge />
                <GlassChip
                  items={stackMarquee}
                  startIndex={0}
                  className="-right-4 -top-6 hidden md:block"
                  ready={ready}
                  delay={0.95}
                  bobDelay={0}
                  cycleMs={4200}
                />
                <GlassChip
                  items={stackMarquee}
                  startIndex={4}
                  className="-bottom-6 left-1/3 hidden md:block"
                  ready={ready}
                  delay={1.1}
                  bobDelay={0.6}
                  cycleMs={4900}
                />
              </div>
            </motion.div>

            <div className="lg:col-span-6">
              <motion.p
                {...fadeUp(0.85)}
                className="max-w-md font-mono text-sm uppercase leading-relaxed tracking-[0.06em] text-ink/65 hover:animate-tv-flicker sm:text-base"
              >
                {person.title} — full-stack development, e-commerce ownership and growth,
                shipped end to end.
              </motion.p>

              <motion.div
                {...fadeUp(1)}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button href="#work" variant="solid">
                  View selected work
                </Button>
                <Button href="#contact" variant="outline">
                  Book a call
                </Button>
              </motion.div>
            </div>
          </div>

          {/* ---------------- Stat strip ---------------- */}
          <motion.dl
            {...fadeUp(1.15)}
            className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-4 md:mt-20"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="bg-paper px-5 py-6 md:px-7 md:py-8">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-medium tracking-tight md:text-[2.75rem] md:leading-none">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted md:text-[11px]">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Stack marquee ---------------- */}
        <motion.div {...fadeUp(1.3)} className="mt-14 border-y border-ink/10 py-5 md:mt-20">
          <Marquee speed={45} pauseOnHover>
            {stackMarquee.map((item) => (
              <span key={item} className="flex items-center gap-8 px-4 md:gap-12 md:px-6">
                <span className="whitespace-nowrap text-lg font-medium tracking-tight text-ink/75 md:text-2xl">
                  {item}
                </span>
                <span aria-hidden className="text-lime-deep">
                  ✳
                </span>
              </span>
            ))}
          </Marquee>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Circular rotating caption anchored to the TV's corner. */
function RotatingBadge() {
  /* Sized so the string just wraps the 34-unit-radius path without overlapping */
  const text = "SCROLL TO EXPLORE · SELECTED WORK · ";

  return (
    <div className="absolute -bottom-8 -left-8 hidden size-28 lg:block">
      <div className="relative grid size-full place-items-center rounded-full bg-ink">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow">
          <defs>
            <path
              id="badge-circle"
              d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
              fill="none"
            />
          </defs>
          <text className="fill-paper font-mono text-[7.5px] tracking-[0.22em]">
            <textPath href="#badge-circle" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
        <svg viewBox="0 0 16 16" className="size-4 text-lime" fill="none" aria-hidden>
          <path
            d="M8 2v12M8 14l-5-5M8 14l5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
