import { person } from "@/lib/data";

/**
 * Where every "Book a call" button goes.
 *
 * Paste your Google Calendar appointment schedule link here (it looks like
 * https://calendar.app.google/xxxxxxxx). Visitors then pick a free slot, and
 * Google adds the event, with a Google Meet link, to your calendar and
 * emails both of you. Create it in Google Calendar: Create → Appointment
 * schedule → set your hours → Location: Google Meet → Save → Share → copy link.
 */
export const APPOINTMENT_URL = "";

/**
 * Until that link exists, the button opens a pre-filled Google Calendar event
 * in the visitor's own calendar with you added as a guest. When they save and
 * send it, the invite lands in your calendar, and Google Calendar adds a Meet
 * link to new events by default.
 */
function inviteTemplateUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Intro call with ${person.name}`,
    details: [
      `A Google Meet call with ${person.name} (${person.title}).`,
      "",
      "Pick a time that suits you, make sure Google Meet video conferencing is added, then save and send the invite.",
      "",
      "A line or two about the role or the project helps me come prepared.",
    ].join("\n"),
    add: person.email,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export const bookCallHref = APPOINTMENT_URL || inviteTemplateUrl();
