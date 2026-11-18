"use client";

import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/components/ui/Icon";
import { person } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Floating WhatsApp shortcut, bottom-right. It stays out of the way while the
 * hero is on screen (the hero has its own WhatsApp link, and the button would
 * sit on top of the name) and slides in once the visitor scrolls past it.
 */
export default function WhatsAppFab() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // One check per frame at most, and React only hears about a change.
    let raf = 0;
    let last: boolean | null = null;
    const update = () => {
      raf = 0;
      const next = window.scrollY > window.innerHeight * 0.7;
      if (next !== last) {
        last = next;
        setShown(next);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${person.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Message ${person.firstName} on WhatsApp`}
      aria-hidden={!shown}
      tabIndex={shown ? undefined : -1}
      className={cn(
        "group fixed bottom-5 right-5 z-[90] grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-10px_rgba(18,140,70,0.7)] transition-[transform,opacity] duration-500 ease-out hover:-translate-y-1 sm:bottom-7 sm:right-7",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <span aria-hidden className="absolute inset-0 animate-ring rounded-full bg-whatsapp" />
      <WhatsAppIcon size={26} className="relative" />
    </a>
  );
}
