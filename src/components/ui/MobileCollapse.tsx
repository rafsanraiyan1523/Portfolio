"use client";

import { Children, useId, useState, type ReactNode } from "react";

import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * On phones, shows the first `initial` items and a button for the rest, so a
 * long list doesn't turn into screens of scrolling. From `sm` up everything is
 * always shown and the button disappears. Hidden items stay in the HTML
 * (display: none on small screens only), so nothing is lost for search engines.
 */
export default function MobileCollapse({
  children,
  initial,
  noun,
  className,
  dark = false,
}: {
  children: ReactNode;
  initial: number;
  /** Plural noun for the button, e.g. "skill groups". */
  noun: string;
  className?: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const items = Children.toArray(children);
  const hidden = items.length - initial;

  return (
    <>
      <div id={id} className={className}>
        {items.map((child, i) => (
          <div key={i} className={cn("h-full", i >= initial && !open && "max-sm:hidden")}>
            {child}
          </div>
        ))}
      </div>
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className={cn(
            "mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors sm:hidden",
            dark
              ? "border-white/15 text-white hover:bg-white/5"
              : "border-line-strong text-ink hover:bg-paper-2",
          )}
        >
          <Icon name={open ? "close" : "plus"} size={16} />
          {open ? "Show fewer" : `Show all ${items.length} ${noun}`}
        </button>
      ) : null}
    </>
  );
}
