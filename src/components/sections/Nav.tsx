"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import { navLinks, person } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    if (open) return;
    // Hide on scroll down past the hero, reveal on any upward scroll.
    setHidden(latest > previous && latest > 320);
  });

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[100]"
        initial={{ y: -100 }}
        animate={{ y: hidden ? "-120%" : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="container-x">
          <div
            className={cn(
              "mt-3 flex items-center justify-between gap-4 rounded-full border px-4 py-2.5 transition-all duration-500 md:mt-5 md:px-5",
              scrolled || open
                ? "border-ink/10 bg-paper/80 shadow-[0_8px_40px_-16px_rgba(12,12,14,0.28)] backdrop-blur-xl"
                : "border-transparent bg-transparent",
            )}
          >
            {/* Wordmark */}
            <Link
              href="#top"
              className="group flex items-center gap-2.5"
              data-cursor="hover"
              aria-label={`${person.name} — home`}
            >
              <span className="grid size-9 place-items-center rounded-full bg-ink text-[11px] font-semibold tracking-tight text-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]">
                {person.initials}
              </span>
              <span className="hidden text-sm font-medium tracking-tight sm:block">
                {person.name}
              </span>
            </Link>

            {/* Desktop links */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <Button href="#contact" size="md" variant="solid">
                  Let&rsquo;s talk
                </Button>
              </div>

              {/* Menu toggle */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                data-cursor="hover"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 lg:hidden"
              >
                <span className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "absolute left-0 block h-px w-full bg-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      open ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 block h-px w-full bg-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      open ? "top-1.5 -rotate-45" : "top-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile / tablet overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink px-5 pb-10 pt-28 text-paper lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[...navLinks, { label: "Contact", href: "#contact" }].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.7, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-paper/10 py-4 text-[2.25rem] font-medium leading-none tracking-tight"
                  >
                    <span className="mr-3 align-super font-mono text-xs text-lime">
                      0{i + 1}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a
                href={`mailto:${person.email}`}
                className="block text-lg tracking-tight text-lime"
              >
                {person.email}
              </a>
              <p className="text-sm text-paper/50">
                {person.location} · {person.timezoneLabel}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className="group relative overflow-hidden rounded-full px-4 py-2 text-sm text-ink/70 transition-colors hover:text-ink"
    >
      {/* Two stacked copies: the top slides out, the bottom slides in. */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </Link>
  );
}
