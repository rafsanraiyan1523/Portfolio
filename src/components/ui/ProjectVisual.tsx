"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Generated abstract mockups, one variant per project.
 *
 * These stand in for screenshots: each is a browser-chrome frame containing a
 * schematic of what the project actually is (storefront, ordering flow, agency
 * site, admin dashboard, analytics, records table), tinted by the project's
 * accent colour. Swap any of these for a real <Image> when screenshots exist.
 */
export default function ProjectVisual({
  variant,
  accent,
  className,
}: {
  variant: number;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ink/10 bg-paper-2",
        className,
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-paper px-4 py-3">
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="size-2 rounded-full bg-ink/15" />
        <span className="ml-3 h-4 flex-1 rounded-full bg-ink/[0.06]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[2.75rem] p-4 md:p-6">
        <Schematic variant={variant} accent={accent} />
      </div>
    </div>
  );
}

function Schematic({ variant, accent }: { variant: number; accent: string }) {
  const shared = "size-full";

  switch (variant % 6) {
    /* -------- Storefront: hero banner + product grid -------- */
    case 0:
      return (
        <div className={cn(shared, "flex flex-col gap-3")}>
          <Bar className="h-[38%] rounded-xl" style={{ background: accent }}>
            <div className="flex h-full flex-col justify-end p-4">
              <span className="block h-2.5 w-1/3 rounded-full bg-ink/25" />
              <span className="mt-2 block h-2 w-1/5 rounded-full bg-ink/15" />
            </div>
          </Bar>
          <div className="grid flex-1 grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Cell key={i} delay={i * 0.08}>
                <span className="block h-[62%] rounded-lg bg-ink/[0.07]" />
                <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-ink/12" />
                <span
                  className="mt-1.5 block h-1.5 w-1/3 rounded-full"
                  style={{ background: accent }}
                />
              </Cell>
            ))}
          </div>
        </div>
      );

    /* -------- Food ordering: menu list + cart -------- */
    case 1:
      return (
        <div className={cn(shared, "grid grid-cols-3 gap-3")}>
          <div className="col-span-2 flex flex-col gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <Cell key={i} delay={i * 0.07} className="flex flex-1 items-center gap-3">
                <span
                  className="block size-full max-h-full w-[22%] rounded-lg"
                  style={{ background: `${accent}33` }}
                />
                <span className="flex-1">
                  <span className="block h-1.5 w-2/3 rounded-full bg-ink/15" />
                  <span className="mt-1.5 block h-1.5 w-1/3 rounded-full bg-ink/[0.08]" />
                </span>
                <span
                  className="block size-5 rounded-full"
                  style={{ background: accent }}
                />
              </Cell>
            ))}
          </div>
          <Cell delay={0.2} className="flex flex-col">
            <span className="block h-2 w-1/2 rounded-full bg-ink/15" />
            <div className="mt-3 flex-1 space-y-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-1.5 rounded-full bg-ink/[0.08]" />
              ))}
            </div>
            <span
              className="block h-7 rounded-lg"
              style={{ background: accent }}
            />
          </Cell>
        </div>
      );

    /* -------- Agency site: hero + service cards + estimator -------- */
    case 2:
      return (
        <div className={cn(shared, "flex flex-col gap-3")}>
          <Cell delay={0} className="flex-[1.2]">
            <span className="block h-3 w-2/3 rounded-full bg-ink/18" />
            <span className="mt-2 block h-3 w-2/5 rounded-full bg-ink/12" />
            <span
              className="mt-3 block h-6 w-24 rounded-full"
              style={{ background: accent }}
            />
          </Cell>
          <div className="grid flex-1 grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <Cell key={i} delay={0.1 + i * 0.08}>
                <span
                  className="block size-6 rounded-lg"
                  style={{ background: `${accent}44` }}
                />
                <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ink/12" />
                <span className="mt-1.5 block h-1.5 w-3/5 rounded-full bg-ink/[0.07]" />
              </Cell>
            ))}
          </div>
        </div>
      );

    /* -------- Admin dashboard: sidebar + stats + table -------- */
    case 3:
      return (
        <div className={cn(shared, "flex gap-3")}>
          <Cell delay={0} className="w-[20%] space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="block h-2 rounded-full"
                style={{
                  background: i === 0 ? accent : "rgb(12 12 14 / 0.08)",
                  width: i === 0 ? "80%" : `${55 + i * 6}%`,
                }}
              />
            ))}
          </Cell>
          <div className="flex flex-1 flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <Cell key={i} delay={0.08 + i * 0.07} className="py-2">
                  <span className="block h-1.5 w-1/2 rounded-full bg-ink/[0.08]" />
                  <span
                    className="mt-2 block h-3 w-2/3 rounded-full"
                    style={{ background: i === 0 ? accent : "rgb(12 12 14 / 0.16)" }}
                  />
                </Cell>
              ))}
            </div>
            <Cell delay={0.3} className="flex-1 space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="block h-1.5 flex-1 rounded-full bg-ink/[0.08]" />
                  <span className="block h-1.5 w-8 rounded-full bg-ink/12" />
                </span>
              ))}
            </Cell>
          </div>
        </div>
      );

    /* -------- Analytics: bar chart + trend -------- */
    case 4:
      return (
        <div className={cn(shared, "flex flex-col gap-3")}>
          <Cell delay={0} className="flex flex-[1.6] items-end gap-2 pb-2">
            {[42, 68, 35, 88, 56, 74, 96].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t-md"
                style={{ background: i === 6 ? accent : `${accent}40` }}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </Cell>
          <div className="grid flex-1 grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <Cell key={i} delay={0.4 + i * 0.1}>
                <span className="block h-1.5 w-1/3 rounded-full bg-ink/[0.08]" />
                <span
                  className="mt-2 block h-3 w-1/2 rounded-full"
                  style={{ background: `${accent}88` }}
                />
              </Cell>
            ))}
          </div>
        </div>
      );

    /* -------- Records / transactions table -------- */
    default:
      return (
        <div className={cn(shared, "flex flex-col gap-3")}>
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Cell key={i} delay={i * 0.06} className="py-2">
                <span
                  className="block h-2.5 w-2/3 rounded-full"
                  style={{ background: i === 0 ? accent : "rgb(12 12 14 / 0.14)" }}
                />
              </Cell>
            ))}
          </div>
          <Cell delay={0.25} className="flex-1 space-y-2.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="flex items-center gap-2.5">
                <span
                  className="block size-3 shrink-0 rounded-full"
                  style={{ background: i % 3 === 0 ? accent : "rgb(12 12 14 / 0.1)" }}
                />
                <span className="block h-1.5 flex-1 rounded-full bg-ink/[0.07]" />
                <span className="block h-1.5 w-10 rounded-full bg-ink/12" />
              </span>
            ))}
          </Cell>
        </div>
      );
  }
}

function Cell({
  children,
  className,
  delay = 0,
}: {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("rounded-xl bg-paper p-3", className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Bar({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      style={style}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
