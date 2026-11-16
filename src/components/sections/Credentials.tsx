import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { additional, credentials, education } from "@/lib/data";
import { keepHyphens } from "@/lib/typography";

/** Research, certification and education, set like the studio's press card. */
export default function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="section-y">
      <div className="shell">
        <SectionHeading
          id="credentials-title"
          title="Research, training and education."
        />

        <div className="mx-auto mt-14 grid max-w-[72rem] gap-6 sm:mt-20">
          {credentials.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <article className="card flex flex-col gap-8 p-6 shadow-[0_30px_60px_-44px_rgba(27,27,27,0.45)] sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent-ink">
                    <Icon name={c.tag === "Research" ? "book" : "award"} size={14} />
                    {c.tag} · {c.issuer}
                  </p>
                  <h3 className="mt-5 text-[clamp(1.375rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{keepHyphens(c.detail)}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{c.period}</p>
                </div>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 shrink-0 items-center justify-center gap-2.5 self-start rounded-full bg-black px-7 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:-translate-y-0.5 lg:self-center"
                >
                  {c.tag === "Research" ? "Read the paper" : "View certificate"}
                  <Icon
                    name="arrowUpRight"
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </article>
            </Reveal>
          ))}

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="card p-6 sm:p-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">Education</h3>
              <ol className="mt-6 divide-y divide-line">
                {education.map((e) => (
                  <li key={e.qualification} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="w-28 shrink-0 text-sm font-medium tabular-nums text-muted">{e.period}</span>
                    <span>
                      <span className="block font-medium text-ink">{e.qualification}</span>
                      <span className="block text-sm text-muted">
                        {e.institution}, {e.location}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.08} className="card p-6 sm:p-10">
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink">Beyond work</h3>
              <ul className="mt-6 grid gap-4">
                {[...additional.memberships, ...additional.activities].map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Icon name="check" size={18} className="mt-px shrink-0 text-accent-ink" />
                    {item}
                  </li>
                ))}
                {additional.languages.map((l) => (
                  <li key={l.name} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <Icon name="globe" size={18} className="mt-px shrink-0 text-accent-ink" />
                    <span>
                      <span className="font-medium text-ink">{l.name}</span>, {l.level}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
