import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Icon, { WhatsAppIcon, type IconName } from "@/components/ui/Icon";
import MobileCollapse from "@/components/ui/MobileCollapse";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { metrics, person, skills } from "@/lib/data";
import { bookCallHref } from "@/lib/booking";
import { keepHyphens } from "@/lib/typography";

const icons: Record<(typeof skills)[number]["group"], IconName> = {
  Languages: "code",
  "Front-End": "monitor",
  "Back-End": "layers",
  "E-Commerce": "cart",
  Databases: "database",
  "SEO & Growth": "search",
  Analytics: "chart",
  "Tools & Practices": "tools",
};

/**
 * The dark band: the full toolkit on the left, and the results it produced
 * on the right, laid out like the studio's investment estimator.
 */
export default function Impact() {
  return (
    <section
      id="toolkit"
      aria-labelledby="toolkit-title"
      className="section-y relative overflow-clip bg-black text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(225,29,72,0.22),transparent_65%)]"
      />
      <div className="shell relative">
        <SectionHeading
          id="toolkit-title"
          dark
          align="left"
          title="The toolkit, and what it moved."
          intro="Everything I use day to day, next to the numbers it produced on a live production store."
        />

        <div className="mt-14 grid gap-6 sm:mt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* ---------------- Skill groups ---------------- */}
          {/* Phones: results first (order), then four groups with a "show all" toggle. */}
          <div>
          <MobileCollapse initial={4} noun="skill groups" dark className="grid gap-3 sm:grid-cols-2 sm:gap-5">
            {skills.map((group, i) => (
              <Reveal key={group.group} delay={(i % 2) * 0.06} className="h-full">
                <div className="h-full rounded-[1.5rem] border border-white/10 bg-night-2 p-5 transition-colors duration-500 hover:border-white/25 sm:rounded-[1.75rem] sm:p-7">
                  <div className="flex items-center gap-3">
                    <Icon name={icons[group.group]} size={20} className="text-accent-glow" />
                    <h3 className="text-base font-bold tracking-[-0.01em] sm:text-lg">{group.group}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/85 sm:rounded-xl sm:px-3 sm:py-2 sm:text-[0.8125rem]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </MobileCollapse>
          </div>

          {/* ---------------- Impact summary ---------------- */}
          <div className="max-lg:order-first">
            <Reveal className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-b from-[#2a0711] via-[#120306] to-black p-6 sm:p-9">
                <Icon
                  name="trend"
                  size={64}
                  strokeWidth={1.25}
                  className="absolute right-6 top-6 hidden text-accent/40 sm:block"
                />
                <p className="label text-accent-glow">Impact summary</p>
                <p className="mt-3 max-w-xs text-sm text-white/65">
                  Go Go Gorgeous, live WooCommerce store, 2025 to 2026
                </p>

                <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
                  {metrics.map((m) => (
                    <div
                      key={m.label}
                      className="grid grid-cols-[auto_1fr] items-center gap-x-5 py-5"
                    >
                      <dt className="col-start-2 row-start-1 text-sm font-semibold text-white">{m.label}</dt>
                      <dd className="col-start-1 row-span-2 row-start-1 min-w-[4.5ch] text-[2.25rem] font-bold leading-none tracking-[-0.04em] text-white">
                        <Counter value={m.value} suffix={m.suffix} />
                      </dd>
                      <dd className="col-start-2 mt-1 text-xs leading-relaxed text-pretty text-white/65">{keepHyphens(m.detail)}</dd>
                    </div>
                  ))}
                </dl>

                <Button
                  href={`https://wa.me/${person.whatsapp}`}
                  variant="accent"
                  icon={<WhatsAppIcon size={18} />}
                  className="mt-8 w-full"
                >
                  Send a brief on WhatsApp
                </Button>
                <p className="mt-4 text-center text-xs text-white/55">
                  Need a full-time hire instead?{" "}
                  <a
                    href={bookCallHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center font-semibold text-white underline-offset-4 hover:underline"
                  >
                    Book a call
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
