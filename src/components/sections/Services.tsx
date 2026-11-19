import Button from "@/components/ui/Button";
import HalftoneNebula, { type NebulaParams } from "@/components/ui/halftone-nebula";
import Icon, { type IconName } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { heroStats, person, services } from "@/lib/data";
import { cn } from "@/lib/utils";
import { keepHyphens } from "@/lib/typography";

const icons: Record<(typeof services)[number]["id"], IconName> = {
  "full-stack": "code",
  ecommerce: "cart",
  seo: "search",
  data: "chart",
};

/**
 * The overview card's sky: the halftone nebula, tuned to the site's own
 * palette (near-black, warm wine haze instead of the default blue, the
 * crimson accent and cream stars), with the planet tucked top-right, clear
 * of the service list.
 */
const SKY: Partial<NebulaParams> = {
  pixel: 5,
  voidColor: "#0b0b0c",
  hazeColor: "#1c0f15",
  duskColor: "#2e0f1d",
  wineColor: "#5c0d31",
  crimsonColor: "#be123c",
  hotColor: "#ff4d79",
  starColor: "#fdfcf8",
  bandAngle: 0.55,
  bandOffset: 0.18,
  sparkles: 7,
  seed: 19,
  planetX: 0.8,
  planetY: 0.76,
  planetRadius: 0.06,
  vignette: 0.4,
}

export default function Services() {
  const [fullStack, ecommerce, seo, data] = services;

  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="shell">
        <SectionHeading
          id="services-title"
          title="Development, commerce and growth, under one roof."
          intro="One person who writes the code, runs the store and reads the analytics, so nothing gets lost between teams."
        />

        <div className="mt-14 grid gap-5 sm:mt-20 xl:grid-cols-[1fr_1fr] xl:gap-8">
          {/* ---------------- Overview card ---------------- */}
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-black bg-night shadow-[0_30px_60px_-36px_rgba(0,0,0,0.6)]">
            <HalftoneNebula params={SKY} maxDpr={1} fps={30} className="h-full">
              {/* Darkens the top of the sky so the label and hint stay readable. */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/85 via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col p-5 sm:p-10">
                <div className="flex items-center justify-between">
                  <p className="label text-white/75">What I do</p>
                  <Icon name="sparkle" size={22} className="text-accent-glow" />
                </div>
                <p className="mt-3 max-w-[17rem] text-xs leading-relaxed text-white/80">
                  Move across the sky to light it up. Tap or click to hang a star.
                </p>

                <ul className="pointer-events-auto mt-16 rounded-3xl bg-card p-3 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] sm:mt-32 sm:p-5 xl:mt-auto">
                  {services.map((service) => (
                    <li key={service.id}>
                      <a
                        href={`#service-${service.id}`}
                        className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors duration-300 hover:bg-paper-2 sm:px-4"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-paper-2 text-ink transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                          <Icon name={icons[service.id]} size={18} />
                        </span>
                        <span className="flex-1 text-[0.9375rem] font-medium text-ink sm:text-base">
                          {service.title}
                        </span>
                        <Icon
                          name="arrowRight"
                          size={16}
                          className="text-muted-light transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <dl className="pointer-events-auto mt-5 grid grid-cols-3 gap-2.5 sm:mt-8 sm:gap-3">
                  {heroStats.slice(0, 2).map((s) => (
                    <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-card px-2 py-4 text-center">
                      <dt className="label mt-1.5 text-muted">{s.label}</dt>
                      <dd className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{s.value}</dd>
                    </div>
                  ))}
                  <div className="flex flex-col-reverse rounded-2xl bg-card px-2 py-4 text-center">
                    <dt className="label mt-1.5 text-muted">Remote-ready</dt>
                    <dd className="text-xl font-bold tracking-tight text-accent-ink sm:text-2xl">
                      {person.timezoneLabel}
                    </dd>
                  </div>
                </dl>
              </div>
            </HalftoneNebula>
          </Reveal>

          {/* ---------------- Discipline cards ---------------- */}
          <div className="grid gap-5 sm:grid-cols-2">
            <ServiceCard service={fullStack} />
            <ServiceCard service={seo} delay={0.06} />
            <ServiceCard service={ecommerce} dark className="sm:col-span-2" delay={0.1} />
            <ServiceCard service={data} delay={0.14} className="sm:col-span-2 xl:col-span-1" />
            <Reveal delay={0.18} className="flex items-center justify-center sm:col-span-2 xl:col-span-1 xl:justify-start">
              <Button href="#contact" variant="solid" iconEnd="arrowRight" className="w-full sm:w-auto">
                Discuss your project
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  dark = false,
  className,
  delay = 0,
}: {
  service: (typeof services)[number];
  dark?: boolean;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <article
        id={`service-${service.id}`}
        className={cn(
          "h-full scroll-mt-28 rounded-[1.5rem] border p-6 transition-shadow duration-500 hover:shadow-[0_24px_48px_-30px_rgba(27,27,27,0.4)] sm:p-7",
          dark ? "border-black bg-black text-white" : "border-line bg-card text-ink",
        )}
      >
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              dark ? "bg-white/10 text-white" : "bg-paper-2 text-ink",
            )}
          >
            <Icon name={icons[service.id]} size={18} />
          </span>
          <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.08em]">{service.title}</h3>
        </div>
        <p className={cn("mt-5 text-sm leading-relaxed", dark ? "text-white/70" : "text-muted")}>
          {keepHyphens(service.blurb)}
        </p>
        <ul className={cn("mt-5 grid gap-2.5", dark && "sm:grid-cols-2")}>
          {service.points.map((point) => (
            <li
              key={point}
              className={cn("flex items-start gap-2.5 text-sm", dark ? "text-white/90" : "text-ink/80")}
            >
              <Icon
                name="check"
                size={17}
                className={cn("mt-px shrink-0", dark ? "text-accent-glow" : "text-muted-light")}
              />
              {point}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}
