import type { ReactNode } from "react";

import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Centered section header in the studio style: a heavy headline that carries
 * the section on its own, with an optional muted line beneath it.
 */
export default function SectionHeading({
  title,
  intro,
  className,
  dark = false,
  align = "center",
  id,
}: {
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
  dark?: boolean;
  align?: "center" | "left";
  id?: string;
}) {
  return (
    <Reveal
      className={cn(
        align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl",
        className,
      )}
    >
      <h2 id={id} className={cn("display-lg", dark ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto max-w-2xl",
            dark ? "text-white/65" : "text-muted",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
