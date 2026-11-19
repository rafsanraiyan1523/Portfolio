import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { person } from "@/lib/data";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  engagement?: string;
  budget?: string;
  message?: string;
  /** Honeypot — bots fill it, humans never see it. */
  website?: string;
};

type Enquiry = {
  name: string;
  email: string;
  company: string;
  engagement: string;
  budget: string;
  message: string;
};

/** Where every enquiry is delivered. */
const INBOX = process.env.CONTACT_TO_EMAIL || person.email;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const subjectFor = (e: Enquiry) => `Portfolio enquiry from ${e.name}`;

function renderText(e: Enquiry) {
  return [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    `Company: ${e.company}`,
    `About: ${e.engagement}`,
    `Budget: ${e.budget}`,
    "",
    e.message,
  ].join("\n");
}

function renderHtml(e: Enquiry) {
  const rows: Array<[string, string]> = [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company],
    ["About", e.engagement],
    ["Budget", e.budget],
  ];
  return `
    <h2 style="font-family:sans-serif">New enquiry from your portfolio</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
      ${rows
        .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
        .join("")}
    </table>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(e.message)}</p>
    <p style="font-family:sans-serif;color:#666">Reply to this email to answer ${escapeHtml(e.name)} directly.</p>
  `;
}

/* ------------------------------------------------------------------ */
/*  Delivery channels, tried in order. Each returns true on success,   */
/*  false if it is not configured, and throws if it was tried and      */
/*  failed (so the next channel gets its turn).                        */
/* ------------------------------------------------------------------ */

/** 1. Gmail over SMTP: needs GMAIL_USER and a Google app password. */
async function viaGmail(e: Enquiry) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return false;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
  await transport.sendMail({
    from: `"Portfolio contact form" <${user}>`,
    to: INBOX,
    replyTo: `"${e.name.replace(/"/g, "")}" <${e.email}>`,
    subject: subjectFor(e),
    text: renderText(e),
    html: renderHtml(e),
  });
  return true;
}

/**
 * 2. Resend: needs RESEND_API_KEY. Without a verified domain, Resend's shared
 * sender (onboarding@resend.dev) can deliver to the account owner's own
 * address, which is all this form needs.
 */
async function viaResend(e: Enquiry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [INBOX],
      reply_to: e.email,
      subject: subjectFor(e),
      html: renderHtml(e),
      text: renderText(e),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return true;
}

/**
 * 3. FormSubmit (formsubmit.co): no account or key. The very first message
 * sends a one-time "Activate form" email to the inbox; after that link is
 * clicked, every enquiry is delivered. Always available as the last resort.
 */
async function viaFormSubmit(e: Enquiry, origin: string) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // FormSubmit ties a form to the site it is used from.
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify({
      _subject: subjectFor(e),
      _replyto: e.email,
      _template: "table",
      _captcha: "false",
      Name: e.name,
      Email: e.email,
      Company: e.company,
      About: e.engagement,
      Budget: e.budget,
      Message: e.message,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const ok = res.ok && (data.success === true || data.success === "true");
  if (!ok) throw new Error(`FormSubmit ${res.status}: ${data.message ?? "unknown error"}`);
  return true;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept honeypot hits so bots don't learn anything.
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const enquiry: Enquiry = {
    name: body.name?.trim() ?? "",
    email: body.email?.trim() ?? "",
    company: body.company?.trim() || "—",
    engagement: body.engagement?.trim() || "—",
    budget: body.budget?.trim() || "—",
    message: body.message?.trim() ?? "",
  };

  if (enquiry.name.length < 2 || !EMAIL_RE.test(enquiry.email) || enquiry.message.length < 10) {
    return NextResponse.json(
      { error: "Please add your name, a valid email and a message of at least a few words." },
      { status: 422 },
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(request.url).origin;

  const channels: Array<[string, () => Promise<boolean>]> = [
    ["gmail", () => viaGmail(enquiry)],
    ["resend", () => viaResend(enquiry)],
    ["formsubmit", () => viaFormSubmit(enquiry, origin)],
  ];

  const failures: string[] = [];
  for (const [name, send] of channels) {
    try {
      if (await send()) return NextResponse.json({ ok: true, via: name });
    } catch (err) {
      failures.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
      console.error(`[contact] ${name} failed:`, err);
    }
  }

  // Every channel failed: say so plainly. The form then offers a direct email link.
  return NextResponse.json(
    {
      error: "Your message couldn't be sent just now. Please email me directly instead.",
      detail: process.env.NODE_ENV === "development" ? failures : undefined,
    },
    { status: 502 },
  );
}
