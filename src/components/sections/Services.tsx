import AmbientOrbs from "@/components/ui/AmbientOrbs";
import { DotPattern } from "@/components/ui/dot-pattern";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";

/**
 * "What I do" as a stack of standalone cards, one per discipline — everything
 * visible up front rather than tucked behind a hover/expand interaction, and
 * the same card at every breakpoint rather than a layout that reshuffles.
 */
export default function Services() {
  return (
    <section id="services" className="section-y grain relative bg-paper">
      <DotPattern className="-z-10 fill-ink/[0.14] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <AmbientOrbs
        orbs={[
          {
            size: "size-[24rem]",
            position: "-right-24 top-10",
            color: "191,23,71",
            opacity: 0.18,
            duration: 15,
            drift: { x: -26, y: 22 },
          },
        ]}
      />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="What I do"
              segments={[
                { text: "Four disciplines," },
                { text: "one", className: "accent-serif" },
                { text: "operator.", className: "accent-serif" },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Most teams hand these off between four people. I run them as one
              loop — which is why the numbers move faster.
            </p>
          </Reveal>
        </div>

        <div className="mt-flow space-y-4 md:space-y-5">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08} amount={0.2}>
              <article className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-2/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:bg-paper-2 md:p-8">
                {/* Accent wash — fades in on hover, echoes the same corner-bleed
                    treatment used on project cards elsewhere on the site. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(120% 140% at 0% 0%, ${service.accent}22, transparent 60%)`,
                  }}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <span
                    className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{ background: `${service.accent}1a`, color: service.accent }}
                  >
                    Discipline {service.number}
                  </span>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink/40 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-ink/30 group-hover:text-ink"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                      <path
                        d="M3 13L13 3M13 3H5.5M13 3V10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <h3 className="display-sm relative mt-5">{service.title}</h3>
                <p className="relative mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                  {service.blurb}
                </p>

                <ul className="relative mt-6 flex flex-wrap gap-2 border-t border-ink/10 pt-5">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full border border-ink/12 px-3 py-1.5 text-xs text-ink/65"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
