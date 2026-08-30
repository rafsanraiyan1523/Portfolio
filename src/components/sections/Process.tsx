import AmbientOrbs from "@/components/ui/AmbientOrbs";
import HowItWorks from "@/components/ui/how-it-works";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/data";

/**
 * How the work runs, as four pinned-note cards side by side — every stage's
 * full detail visible at once instead of behind a scroll-driven reveal.
 *
 * Top padding is intentionally tighter than the standard `section-y` rhythm:
 * this section and Services above it share the same paper background, so
 * their padding would otherwise stack into a gap with no colour change to
 * justify it.
 */
export default function Process() {
  return (
    <section
      id="process"
      className="grain relative bg-paper pb-[var(--space-section)] pt-16 md:pb-[var(--space-section-lg)] md:pt-20"
    >
      <AmbientOrbs
        orbs={[
          {
            size: "size-[22rem]",
            position: "-left-20 bottom-0",
            color: "191,23,71",
            opacity: 0.16,
            duration: 14,
            delay: 0.8,
            drift: { x: 22, y: -18 },
          },
        ]}
      />
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.618fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="Process"
              segments={[
                { text: "A loop, not a" },
                { text: "handoff.", className: "accent-serif" },
              ]}
            />
          </div>
          <Reveal delay={0.15} className="lg:pt-20">
            <p className="text-base leading-relaxed text-muted md:text-lg">
              Four stages that feed each other. Optimise sends findings straight
              back into discover — which is where compounding growth comes from.
            </p>
          </Reveal>
        </div>

        <HowItWorks
          className="mt-flow"
          steps={process.map((stage) => ({
            number: stage.step,
            title: stage.title,
            description: stage.blurb,
            deliverables: stage.deliverables,
            accent: stage.accent,
          }))}
        />
      </div>
    </section>
  );
}
