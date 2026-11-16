"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import Icon from "@/components/ui/Icon";
import { navLinks, person } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Tracks which section is under the nav so its link can carry the underline.
 * Reads scroll position directly (the last section whose top has passed 40% of
 * the viewport) rather than an IntersectionObserver band, so a long jump, a
 * section taller than the band, or the footer at the very bottom can never
 * leave a stale link lit.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let current = ids[0];
      let best = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          current = id;
        }
      }
      if (atBottom) current = "contact";
      setActive(parentOf[current] ?? current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

// Sections without their own nav link light up the item they sit under.
const parentOf: Record<string, string> = {
  toolkit: "work",
  process: "experience",
  credentials: "experience",
  faq: "contact",
};
const sectionIds = [...navLinks.map((l) => l.href.slice(1)), ...Object.keys(parentOf)];

export default function Nav() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-[100] flex justify-center px-3 sm:top-6">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={cn(
          "relative w-full max-w-[50rem] rounded-full border border-white/5 text-white transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled
            ? "bg-[#1b1b1b]/80 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl"
            : "bg-black shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)]",
        )}
      >
        <div className="flex h-14 items-center gap-6 pl-2 pr-2">
          <a
            href="#top"
            aria-label={`${person.name}, back to top`}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-[0.8125rem] font-bold tracking-tight text-white ring-2 ring-white/10 transition-transform duration-300 hover:scale-105"
          >
            {person.initials}
          </a>

          <ul className="hidden flex-1 items-center gap-5 md:flex lg:gap-6">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block py-2 text-[0.6875rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300",
                      isActive ? "text-white" : "text-white/60 hover:text-white",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-accent transition-transform duration-500 ease-out",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            className="ml-auto hidden h-10 items-center rounded-full border border-white/20 px-5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black md:inline-flex"
          >
            Hire me
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-[0.6875rem] font-bold uppercase tracking-[0.06em] md:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={16} />
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-[1.75rem] border border-white/10 bg-black p-3 shadow-[0_24px_48px_-20px_rgba(0,0,0,0.6)] md:hidden"
            >
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] transition-colors",
                        active === link.href.slice(1)
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {link.label}
                      <Icon name="arrowRight" size={16} className="text-accent-glow" />
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-12 items-center justify-center rounded-full bg-accent text-xs font-bold uppercase tracking-[0.08em] text-white"
              >
                Hire me
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
