import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/data";
import { keepHyphens } from "@/lib/typography";

/** Four-stage roadmap. The numbers stay because the order is the point. */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y bg-paper-2/60">
      <div className="shell">
        <SectionHeading
          id="process-title"
          title="My roadmap to a store that sells."
          intro="Four stages that feed each other. What I learn in optimise goes straight back into discover."
        />

        <ol className="relative mt-14 grid gap-5 sm:mt-20 md:grid-cols-2 xl:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-line-strong xl:block"
          />
          {process.map((stage, i) => (
            <li key={stage.step} className="relative">
              <Reveal delay={i * 0.08} className="flex h-full flex-col">
                <span className="relative z-10 mx-auto grid size-10 place-items-center rounded-full bg-black text-xs font-bold text-white ring-8 ring-paper-2 xl:mx-auto">
                  {stage.step}
                </span>
                <div className="card mt-5 flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="text-xl font-bold tracking-[-0.02em] text-ink">{stage.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{keepHyphens(stage.blurb)}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                    {stage.deliverables.map((d) => (
                      <li key={d} className="rounded-full bg-paper-2 px-3 py-1.5 text-xs font-medium text-ink/75">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
