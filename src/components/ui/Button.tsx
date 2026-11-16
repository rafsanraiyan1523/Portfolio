import type { ReactNode } from "react";

import Icon, { type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "accent" | "light" | "ghost-dark";

const variants: Record<Variant, string> = {
  solid:
    "bg-black text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)] hover:bg-ink hover:shadow-[0_16px_32px_-14px_rgba(0,0,0,0.6)]",
  outline: "border border-line-strong bg-card text-ink hover:border-ink hover:bg-white",
  accent:
    "bg-gradient-to-r from-accent to-accent-ink text-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.55)] hover:shadow-[0_18px_32px_-14px_rgba(0,0,0,0.6)]",
  light: "bg-white text-black hover:bg-paper",
  "ghost-dark": "border border-white/20 text-white hover:border-white/50 hover:bg-white/5",
};

/**
 * Pill button in the studio style: bold uppercase label, generous padding.
 * Always rendered as a link — every CTA on the site goes somewhere.
 */
export default function Button({
  href,
  children,
  variant = "solid",
  icon,
  iconEnd,
  external,
  className,
  size = "md",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName | ReactNode;
  iconEnd?: IconName;
  external?: boolean;
  className?: string;
  size?: "md" | "sm";
}) {
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  const renderIcon = (value: IconName | ReactNode) =>
    typeof value === "string" ? <Icon name={value as IconName} size={17} /> : value;

  return (
    <a
      href={href}
      {...(isExternal && href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase tracking-[0.06em] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0",
        size === "md" ? "h-12 px-7 text-[0.75rem] sm:h-[3.25rem] sm:px-8" : "h-10 px-5 text-[0.6875rem]",
        variants[variant],
        className,
      )}
    >
      {icon ? renderIcon(icon) : null}
      <span>{children}</span>
      {iconEnd ? (
        <Icon
          name={iconEnd}
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      ) : null}
    </a>
  );
}
