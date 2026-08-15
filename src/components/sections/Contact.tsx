"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Magnetic from "@/components/ui/Magnetic";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";
import { person } from "@/lib/data";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const engagements = [
  "Full-time role",
  "Contract / freelance",
  "Full-stack development project",
  "E-commerce manager role",
  "SEO & performance audit",
  "Something else",
];

const budgets = [
  "Under $2K",
  "$2K – $5K",
  "$5K – $10K",
  "$10K+",
  "Salaried role",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        fallback?: boolean;
      };

      // Delivery isn't wired up yet — hand off to the visitor's mail client
      // so the message still reaches the inbox.
      if (payload.fallback) {
        const subject = encodeURIComponent(`Portfolio enquiry — ${data.name || ""}`);
        const body = encodeURIComponent(
          [
            `Name: ${data.name || ""}`,
            `Email: ${data.email || ""}`,
            `Company: ${data.company || "—"}`,
            `Engagement: ${data.engagement || "—"}`,
            `Budget: ${data.budget || "—"}`,
            "",
            data.message || "",
          ].join("\n"),
        );
        window.location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
        setStatus("sent");
        form.reset();
        return;
      }

      setStatus("error");
      setError(payload.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setError("Network error. Please email me directly.");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable — the mailto link below still works. */
    }
  }

  return (
    <section
      id="contact"
      className="section-t on-dark relative overflow-hidden bg-ink text-paper"
    >
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] top-0 size-[60vw] rounded-full opacity-40 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(191,23,71,0.32) 0%, rgba(191,23,71,0) 70%)",
        }}
      />

      <div className="container-x relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.618fr] lg:gap-16">
          {/* ---------------- Pitch ---------------- */}
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="size-1.5 rounded-full bg-lime" />
              <span className="eyebrow text-paper/55">Contact</span>
            </div>

            <RevealText
              as="h2"
              className="display-lg text-paper"
              segments={[
                { text: "Let’s build something that" },
                { text: "converts.", className: "accent-serif text-lime" },
              ]}
            />

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-base leading-relaxed text-paper/55 md:text-lg">
                Hiring, contracting, or just want a second opinion on why your
                store isn&rsquo;t converting — send it over. I reply within a
                working day.
              </p>
            </Reveal>

            {/* Direct channels */}
            <Reveal delay={0.25} className="mt-10 space-y-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/10">
              <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    Email
                  </p>
                  <a
                    href={`mailto:${person.email}`}
                    data-cursor="hover"
                    className="link-underline mt-1 block truncate text-sm text-paper md:text-base"
                  >
                    {person.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  data-cursor="hover"
                  className="shrink-0 rounded-full border border-paper/25 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-lime hover:text-lime"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                    Phone / WhatsApp
                  </p>
                  <a
                    href={`tel:${person.phoneHref}`}
                    data-cursor="hover"
                    className="link-underline mt-1 block text-sm text-paper md:text-base"
                  >
                    {person.phone}
                  </a>
                </div>
                <a
                  href={`https://wa.me/${person.whatsapp}?text=${encodeURIComponent(
                    `Hi ${person.firstName}, I found your portfolio and wanted to connect.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-paper/25 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:border-lime hover:text-lime"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="size-3">
                    <path d="M8 1a7 7 0 0 0-6.05 10.5L1 15l3.6-.94A7 7 0 1 0 8 1Zm0 1.4a5.6 5.6 0 0 1 4.75 8.56l-.16.25.31 1.86-1.9-.5-.24.14A5.6 5.6 0 1 1 8 2.4Zm-2.4 2.5c-.14 0-.36.05-.55.27-.19.21-.72.7-.72 1.72s.74 2 .84 2.14c.1.14 1.44 2.3 3.6 3.13 1.78.69 2.14.55 2.53.52.39-.04 1.26-.51 1.44-1.01.18-.5.18-.92.13-1.01-.05-.09-.19-.14-.38-.24-.2-.1-1.16-.57-1.34-.64-.18-.06-.31-.09-.44.1-.13.19-.5.63-.62.77-.11.13-.23.15-.42.05-.2-.1-.83-.3-1.58-.97-.58-.52-.98-1.16-1.09-1.36-.11-.19-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.11.13-.19.2-.32.06-.13.03-.24-.02-.34-.05-.1-.44-1.08-.61-1.47-.16-.39-.32-.33-.44-.34l-.38-.01Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              <div className="bg-ink px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                  Based in
                </p>
                <p className="mt-1 text-sm text-paper md:text-base">
                  {person.location} · {person.timezoneLabel}
                </p>
              </div>
            </Reveal>
          </div>

          {/* ---------------- Form ---------------- */}
          <div>
            <Reveal delay={0.1}>
              <div className="relative rounded-3xl border border-paper/15 bg-paper/[0.04] p-6 backdrop-blur-sm md:p-9">
                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="flex min-h-[26rem] flex-col items-start justify-center"
                    >
                      <span className="grid size-14 place-items-center rounded-full bg-lime text-paper">
                        <svg viewBox="0 0 16 16" fill="none" className="size-6">
                          <path
                            d="M3 8.5l3.5 3.5L13 5"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <h3 className="display-sm mt-6">Message on its way.</h3>
                      <p className="mt-3 max-w-sm text-paper/55">
                        Thanks for reaching out — I&rsquo;ll get back to you
                        within a working day.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        data-cursor="hover"
                        className="link-underline mt-6 text-sm font-medium text-lime"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-5"
                      noValidate
                    >
                      {/* Honeypot */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                        className="sr-only"
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Name" name="name" required placeholder="Your name" />
                        <Field
                          label="Email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                        />
                      </div>

                      <Field
                        label="Company"
                        name="company"
                        placeholder="Optional"
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <SelectField
                          label="Engagement"
                          name="engagement"
                          options={engagements}
                        />
                        <SelectField label="Budget" name="budget" options={budgets} />
                      </div>

                      <Field
                        label="Project details"
                        name="message"
                        required
                        textarea
                        placeholder="What are you building, and what's in the way?"
                      />

                      {status === "error" && error && (
                        <p role="alert" className="text-sm text-[#ff9a7a]">
                          {error}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Magnetic className="inline-block">
                          <button
                            type="submit"
                            disabled={status === "sending"}
                            data-cursor="hover"
                            className="group/btn relative inline-flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-lime px-8 text-[0.95rem] font-medium text-paper transition-colors duration-300 group-hover/btn:text-ink disabled:opacity-60 md:h-16 md:px-10"
                          >
                            <span
                              aria-hidden
                              className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-y-0"
                            />
                            <span className="relative z-10">
                              {status === "sending" ? "Sending…" : "Send message"}
                            </span>
                          </button>
                        </Magnetic>

                        <p className="text-xs text-paper/40">
                          Or email{" "}
                          <a
                            href={`mailto:${person.email}`}
                            className="link-underline text-paper/70"
                          >
                            {person.email}
                          </a>
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Oversized closing marquee */}
      <div className="mt-24 border-t border-paper/12 py-8 md:mt-32">
        <Marquee speed={28} fade={false}>
          <span className="flex items-center gap-10 px-5">
            <span className="whitespace-nowrap text-[13vw] font-medium leading-none tracking-tighter text-paper/90 md:text-[9vw]">
              Available for work
            </span>
            <span className="text-lime" aria-hidden>
              ✳
            </span>
            <span className="accent-serif whitespace-nowrap text-[13vw] leading-none text-lime md:text-[9vw]">
              Let&rsquo;s talk
            </span>
            <span className="text-lime" aria-hidden>
              ✳
            </span>
          </span>
        </Marquee>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  label,
  name,
  type = "text",
  required = false,
  textarea = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
}) {
  const shared =
    "peer w-full rounded-xl border border-paper/15 bg-transparent px-4 py-3.5 text-sm text-paper placeholder:text-paper/25 transition-colors duration-300 focus:border-lime focus:outline-none";

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
        {label}
        {required && <span className="ml-1 text-lime">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={5}
          placeholder={placeholder}
          className={cn(shared, "resize-none")}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={shared}
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-paper/15 bg-transparent bg-[length:12px] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 text-sm text-paper transition-colors duration-300 focus:border-lime focus:outline-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23f4f2ec' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled className="bg-ink text-paper">
          Select…
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-ink text-paper">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
