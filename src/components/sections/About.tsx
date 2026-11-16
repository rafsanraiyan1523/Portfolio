import Image from "next/image";

import Icon, { type IconName } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { additional, education, experience, person, summaryLong } from "@/lib/data";
import { keepHyphens } from "@/lib/typography";

export default function About() {
  const current = experience.find((job) => job.current);
  const degree = education[0];

  const facts: { icon: IconName; label: string; value: string }[] = [
    {
      icon: "monitor",
      label: "Now",
      value: current ? `${current.role}, ${current.company}` : person.title,
    },
    { icon: "pin", label: "Based in", value: `${person.location} (${person.timezoneLabel})` },
    { icon: "book", label: "Studied", value: `${degree.qualification}, ${degree.institution}` },
    {
      icon: "globe",
      label: "Languages",
      value: additional.languages.map((l) => `${l.name} (${l.level.split(" —")[0]})`).join(", "),
    },
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="shell">
        <Reveal className="mx-auto max-w-5xl text-center">
          <h2
            id="about-title"
            className="text-[clamp(1.75rem,4.2vw,3.5rem)] font-normal leading-[1.18] tracking-[-0.03em] text-ink"
          >
            I build <span className="whitespace-nowrap">high-performing</span> websites, <span className="whitespace-nowrap">e-commerce</span> stores and the systems behind them,
            then make them <span className="font-semibold text-accent-ink">grow</span>.
          </h2>
        </Reveal>

        <div className="mt-16 grid items-start gap-6 sm:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Rendered at the photo's own 3:4 shape, so the portrait is never cropped. */}
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-paper-2 lg:sticky lg:top-28">
            <Image
              src={person.photo}
              alt={`Portrait of ${person.name}`}
              width={person.photoSize[0]}
              height={person.photoSize[1]}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="block h-auto w-full"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-black/70 px-5 py-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6">
              <div>
                <p className="text-base font-semibold">{person.name}</p>
                <p className="text-xs text-white/75">{person.title}</p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold">
                {person.initials}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="card flex flex-col p-6 sm:p-10">
            <p className="text-base leading-relaxed text-muted sm:text-lg sm:leading-[1.75]">
              {keepHyphens(summaryLong)}
            </p>

            <dl className="mt-8 grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1 xl:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="flex gap-4 border-b border-line py-5">
                  <Icon name={fact.icon} size={20} className="mt-0.5 shrink-0 text-accent-ink" />
                  <div className="min-w-0">
                    <dt className="label text-muted">{fact.label}</dt>
                    <dd className="mt-2 text-[0.9375rem] font-medium leading-snug text-ink">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              {person.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 text-xs font-semibold uppercase tracking-[0.06em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Icon
                    name={s.label === "LinkedIn" ? "linkedin" : s.label === "GitHub" ? "github" : "mail"}
                    size={16}
                  />
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
