import RidgelineDitherFooter, { type RidgelineColumn } from "@/components/ui/ridgeline-dither-footer";
import { experience, navLinks, person, projects } from "@/lib/data";

const SANS = "var(--font-poppins), ui-sans-serif, system-ui, sans-serif";

/** Site footer: the ridgeline dither range, printed in the portfolio's crimson. */
export default function Footer() {
  const current = experience.find((job) => job.current);
  const github = person.socials.find((s) => s.label === "GitHub")?.href;
  const linkedin = person.socials.find((s) => s.label === "LinkedIn")?.href;

  const columns: RidgelineColumn[] = [
    {
      title: "Navigate",
      links: navLinks.map((l) => ({ label: l.label, href: l.href })),
    },
    {
      title: "Selected work",
      links: projects.slice(0, 4).map((p) => ({ label: p.name, href: p.links?.[0]?.href ?? "#work" })),
    },
    {
      title: "Get in touch",
      links: [
        { label: "Email", href: `mailto:${person.email}` },
        { label: "WhatsApp", href: `https://wa.me/${person.whatsapp}` },
        { label: "Call", href: `tel:${person.phoneHref}` },
        ...(linkedin ? [{ label: "LinkedIn", href: linkedin }] : []),
      ],
    },
  ];

  return (
    <RidgelineDitherFooter
      preset="crimson"
      seed={11}
      ridges={6}
      pixel={3}
      name={person.name}
      brandHref="#top"
      logo={
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-full bg-accent text-[0.75rem] font-bold tracking-tight text-white"
        >
          {person.initials}
        </span>
      }
      tagline={`${current ? `${current.role} at BAPI` : person.title} and full-stack developer in ${person.location}. ${person.availability}.`}
      columns={columns}
      socials={[
        ...(linkedin ? [{ icon: "linkedin" as const, href: linkedin }] : []),
        ...(github ? [{ icon: "github" as const, href: github }] : []),
      ]}
      copyright={`© ${new Date().getFullYear()} ${person.name}. Built in ${person.location.split(",")[0]}.`}
      credit={null}
      maxWidth="108rem"
      fontFamily={SANS}
      monoFamily={SANS}
      height="640px"
    />
  );
}
