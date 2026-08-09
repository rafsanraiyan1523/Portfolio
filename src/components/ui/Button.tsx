"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import Magnetic from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "solid" | "lime" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium transition-colors duration-300";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[0.95rem] md:h-16 md:px-9 md:text-base",
};

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper",
  lime: "bg-lime text-paper",
  outline: "border border-ink/20 text-ink hover:border-ink/40",
  ghost: "border border-paper/25 text-paper hover:border-paper/50",
};

/** Fill that wipes up from the bottom on hover. */
const fills: Record<Variant, string> = {
  solid: "bg-lime",
  lime: "bg-ink",
  outline: "bg-ink",
  ghost: "bg-paper",
};

const hoverText: Record<Variant, string> = {
  solid: "group-hover/btn:text-paper",
  lime: "group-hover/btn:text-paper",
  outline: "group-hover/btn:text-paper",
  ghost: "group-hover/btn:text-ink",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  magnetic?: boolean;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export default function Button({
  children,
  variant = "solid",
  size = "lg",
  className,
  icon,
  magnetic = true,
  ...rest
}: Props) {
  const inner = (
    <Link
      className={cn(base, sizes[size], variants[variant], hoverText[variant], className)}
      data-cursor="hover"
      {...rest}
    >
      {/* Wipe fill */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0",
          fills[variant],
        )}
      />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon ?? <Arrow />}
      </span>
    </Link>
  );

  return magnetic ? <Magnetic className="inline-block">{inner}</Magnetic> : inner;
}

function Arrow() {
  return (
    <span className="relative block size-4 overflow-hidden" aria-hidden>
      <ArrowSvg className="absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full group-hover/btn:-translate-y-full" />
      <ArrowSvg className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
    </span>
  );
}

function ArrowSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-4", className)}>
      <path
        d="M3 13L13 3M13 3H5.5M13 3V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
