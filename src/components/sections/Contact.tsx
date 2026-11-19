"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Icon, { WhatsAppIcon } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import { person } from "@/lib/data";
import { bookCallHref } from "@/lib/booking";
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

const budgets = ["Under $2K", "$2K – $5K", "$5K – $10K", "$10K+", "Salaried role"];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  /** Pre-filled mailto link, offered only when sending fails. */
  const [mailto, setMailto] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus("sending");
    setError(null);
    setMailto(null);

    // If delivery fails, the visitor can still send the same message from
    // their own mail app in one click; nothing they typed is lost.
    const directMail = () => {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name || "the website"}`);
      const body = encodeURIComponent(
        [
          `Name: ${data.name || ""}`,
          `Email: ${data.email || ""}`,
          `Company: ${data.company || "—"}`,
          `About: ${data.engagement || "—"}`,
          `Budget: ${data.budget || "—"}`,
          "",
          data.message || "",
        ].join("\n"),
      );
      return `mailto:${person.email}?subject=${subject}&body=${body}`;
    };

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

      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setError(payload.error ?? "Your message couldn't be sent just now. Please email me directly instead.");
      // A validation problem is the visitor's to fix; anything else gets the direct-email escape hatch.
      if (res.status !== 422) setMailto(directMail());
    } catch {
      setStatus("error");
      setError("You seem to be offline. Please check your connection, or email me directly.");
      setMailto(directMail());
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard unavailable: the mailto link still works. */
    }
  }

  const channels = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: person.whatsappDisplay,
      href: `https://wa.me/${person.whatsapp}`,
      icon: <WhatsAppIcon size={22} />,
    },
    {
      key: "call",
      label: "Call",
      value: person.phone,
      href: `tel:${person.phoneHref}`,
      icon: <Icon name="phone" size={22} />,
    },
    {
      key: "email",
      label: "Email",
      value: person.email,
      href: `mailto:${person.email}`,
      icon: <Icon name="mail" size={22} />,
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y">
      <div className="shell">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-black text-base font-bold text-white">
            {person.initials}
          </span>
          <h2 id="contact-title" className="display-hero mt-8 text-[clamp(2.5rem,7vw,5.5rem)]">
            Ready to build something that sells?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-xl">
            Hiring for a role or planning a build, tell me what you need. I reply within a working
            day, usually sooner.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href={bookCallHref} variant="solid" icon="video">
              Book a call
            </Button>
            {/* Phones: email and call are the rows right below, so no duplicate buttons. */}
            <Button href={`mailto:${person.email}`} variant="outline" icon="mail" className="max-sm:hidden">
              Email me
            </Button>
            <Button href={`tel:${person.phoneHref}`} variant="outline" icon="phone" className="max-sm:hidden">
              Call {person.phone}
            </Button>
          </div>
        </Reveal>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {channels.map((c, i) => (
            <li key={c.key}>
              <Reveal delay={i * 0.06}>
                <a
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="card group flex items-center gap-4 px-5 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgba(27,27,27,0.45)] sm:flex-col sm:gap-0 sm:px-4 sm:py-6 sm:text-center"
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full bg-paper-2 sm:size-auto sm:bg-transparent",
                      c.key === "whatsapp" ? "text-[#128c4a]" : "text-accent-ink",
                    )}
                  >
                    {c.icon}
                  </span>
                  <span className="min-w-0 sm:contents">
                    <span className="label block text-muted sm:mt-3">{c.label}</span>
                    <span className="mt-1 block break-all text-[0.9375rem] font-semibold text-ink sm:mt-2">{c.value}</span>
                  </span>
                  <Icon name="arrowRight" size={16} className="ml-auto shrink-0 text-muted-light sm:hidden" />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ---------------- Message form ---------------- */}
        <Reveal className="mx-auto mt-16 max-w-4xl sm:mt-24">
          <div className="card p-6 sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="display-md">Or send a message</h3>
                <p className="mt-2 text-sm text-muted">It lands in the same inbox as email.</p>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-accent-ink hover:underline sm:self-auto"
              >
                <Icon name="copy" size={16} />
                <span aria-live="polite">{copied ? "Email copied" : "Copy email address"}</span>
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-8 rounded-2xl bg-paper-2 p-8 text-center"
                  role="status"
                >
                  <Icon name="check" size={32} className="mx-auto text-accent-ink" />
                  <p className="mt-4 text-lg font-semibold text-ink">Message on its way.</p>
                  <p className="mt-2 text-sm text-muted">I will reply within a working day.</p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-accent-ink hover:underline"
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
                  className="mt-8 grid gap-4 sm:grid-cols-2"
                  noValidate={false}
                >
                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <div aria-hidden className="absolute -left-[9999px]">
                    <label>
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <Field label="Name" name="name" required placeholder="Your name" autoComplete="name" minLength={2} />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                  <Field label="Company" name="company" placeholder="Optional" autoComplete="organization" />
                  <SelectField label="What is it about?" name="engagement" options={engagements} />
                  <SelectField label="Budget" name="budget" options={budgets} className="sm:col-span-2" />
                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-ink">Message</span>
                    <textarea
                      name="message"
                      required
                      minLength={10}
                      rows={5}
                      placeholder="A few lines on the role or the project"
                      className="w-full resize-y rounded-2xl border border-line-strong bg-paper px-4 py-3.5 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink"
                    />
                  </label>

                  {status === "error" && error ? (
                    <div role="alert" className="rounded-2xl bg-accent-soft/60 px-4 py-3 sm:col-span-2">
                      <p className="text-sm font-medium text-accent-ink">{error}</p>
                      {mailto ? (
                        <a
                          href={mailto}
                          className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
                        >
                          <Icon name="mail" size={16} />
                          Send it from your email app instead
                        </a>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-accent to-accent-ink px-8 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_12px_24px_-12px_rgba(27,27,27,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                    >
                      {status === "sending" ? "Sending…" : "Send message"}
                      <Icon name="send" size={16} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputClass =
  "h-12 w-full rounded-2xl border border-line-strong bg-paper px-4 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-ink">
        {label}
        {props.required ? <span className="text-accent-ink"> *</span> : null}
      </span>
      <input {...props} className={inputClass} />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  className,
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  return (
    <label className={cn("grid gap-2", className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <select name={name} defaultValue="" className={cn(inputClass, "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10")} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b1b1b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
        <option value="">Choose one</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
