"use client";

import { motion } from "motion/react";
import { Fragment } from "react";

import Button from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import Marquee from "@/components/ui/Marquee";
import { NeuralNoise } from "@/components/ui/neural-noise";
import Reveal from "@/components/ui/Reveal";
import { experience, heroStats, person, stackMarquee } from "@/lib/data";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;
const tagline = ["Code.", "Commerce.", "Growth."];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const current = experience.find((job) => job.current);

  // Always animate to the visible state: reduced motion only shortens the
  // transition, so a late-resolving media query can never strand text at 0.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: reduced ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  });

  return (
    <>
      <section id="top" className="shell pt-[7.5rem] sm:pt-40 lg:pt-[12.5rem]">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="display-hero text-[clamp(2.75rem,12vw,6rem)] uppercase">
            {person.name.split(" ").map((word, i) => (
              <motion.span key={word} className="inline-block pr-[0.22em] last:pr-0" {...rise(0.1 + i * 0.12)}>
                {word}
              </motion.span>
            ))}
            <span className="sr-only">, {person.title}</span>
          </h1>

          <motion.p
            {...rise(0.5)}
            className="mx-auto mt-7 max-w-[46rem] text-base leading-relaxed text-muted sm:mt-8 sm:text-xl sm:leading-[1.6]"
          >
            I build fast websites and <span className="whitespace-nowrap">e-commerce</span> stores, then grow them with technical SEO and
            conversion work. {current ? `${current.role} at BAPI` : person.title}, with{" "}
            {person.yearsExperience} years shipping production platforms.
          </motion.p>

          <motion.div
            {...rise(0.65)}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Button href="#contact" variant="solid">
              Book a call
            </Button>
            <Button
              href={`https://wa.me/${person.whatsapp}`}
              variant="outline"
              icon={<WhatsAppIcon size={18} className="text-whatsapp" />}
            >
              WhatsApp me
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Tagline band ---------------- */}
      <div className="shell mt-16 sm:mt-24 lg:mt-32">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduced ? { duration: 0 } : { duration: 1.2, delay: 0.75, ease: EASE }}
        >
          <div className="relative isolate flex min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-black px-6 py-16 text-center shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] sm:min-h-[30rem] sm:rounded-[2.5rem] lg:min-h-[36rem]">
            <NeuralNoise className="-z-10" />
            {/* Centre vignette keeps the type legible over the brightest filaments. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,transparent_62%)]"
            />
            <p className="text-[clamp(2.5rem,8.4vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.6)]">
              {tagline.map((word) => (
                <span key={word} className="inline-block pr-[0.22em] last:pr-0">
                  {word}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-xl text-sm font-medium text-white/75 sm:text-base">
              {[...person.roles.slice(0, 3), person.location].map((item, i) => (
                <Fragment key={item}>
                  {i > 0 ? " · " : null}
                  <span className="whitespace-nowrap">{item}</span>
                </Fragment>
              ))}
            </p>
            <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-70" />
                <span className="relative size-2 rounded-full bg-whatsapp" />
              </span>
              {person.availability}
            </p>
          </div>
        </motion.div>
      </div>

      {/* ---------------- Stack ticker ---------------- */}
      <div className="mt-20 border-t border-line py-10 sm:mt-28 sm:py-12" aria-label="Tech stack">
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
