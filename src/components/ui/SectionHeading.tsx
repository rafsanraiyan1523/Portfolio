"use client";

import { motion, useReducedMotion } from "motion/react";

import RevealText, { type Segment } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

/**
 * Standard section header: a monospace eyebrow with a rule that draws itself,
 * followed by the masked headline reveal.
 */
export default function SectionHeading({
  eyebrow,
  segments,
  className,
  headingClassName,
  align = "left",
  dark = false,
  as = "h2",
}: {
  eyebrow: string;
  segments: readonly Segment[];
  className?: string;
  headingClassName?: string;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2" | "h3";
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn(
          "mb-6 flex items-center gap-4 md:mb-9",
          align === "center" && "justify-center",
        )}
      >
        <motion.span
          className={cn("size-1.5 rounded-full", dark ? "bg-lime" : "bg-ink")}
          initial={reduced ? undefined : { scale: 0 }}
          whileInView={reduced ? undefined : { scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className={cn("eyebrow", dark ? "text-paper/55" : "text-muted")}>
          {eyebrow}
        </span>
        <motion.span
          className={cn(
            "h-px flex-1 origin-left",
            dark ? "bg-paper/20" : "bg-ink/15",
            align === "center" && "max-w-24",
          )}
          initial={reduced ? undefined : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <RevealText
        as={as}
        segments={segments}
        className={cn("display-lg max-w-5xl", headingClassName)}
      />
    </div>
  );
}
