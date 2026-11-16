import { WhatsAppIcon } from "@/components/ui/Icon";
import { person } from "@/lib/data";

/** Floating WhatsApp shortcut, bottom-right on every screen. */
export default function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${person.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Message ${person.firstName} on WhatsApp`}
      className="group fixed bottom-5 right-5 z-[90] grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_12px_28px_-10px_rgba(18,140,70,0.7)] transition-transform duration-300 hover:-translate-y-1 sm:bottom-7 sm:right-7"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ring rounded-full bg-whatsapp"
      />
      <WhatsAppIcon size={26} className="relative" />
    </a>
  );
}
