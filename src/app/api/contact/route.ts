import { NextResponse } from "next/server";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json(
      { error: "Please provide a name, a valid email and a longer message." },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Not configured yet — tell the client so it can fall back to a mail client.
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email delivery is not configured.", fallback: true },
      { status: 501 },
    );
  }

  const rows: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Company", body.company?.trim() || "—"],
    ["Engagement", body.engagement?.trim() || "—"],
    ["Budget", body.budget?.trim() || "—"],
  ];

  const html = `
    <h2>New enquiry from ${escapeHtml(person.name)}'s site</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [person.email],
      reply_to: email,
      subject: `Portfolio enquiry — ${name}`,
      html,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Could not send the message. Please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
