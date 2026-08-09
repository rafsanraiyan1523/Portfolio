import { ImageResponse } from "next/og";

import { person } from "@/lib/data";

export const alt = `${person.name} — ${person.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0e",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#bf1747",
              color: "#f4f2ec",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            RR
          </div>
          <div
            style={{
              color: "rgba(244,242,236,0.55)",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {`${person.location} · ${person.timezoneLabel}`}
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#f4f2ec",
              fontSize: 82,
              lineHeight: 1.02,
              letterSpacing: -3.5,
              fontWeight: 600,
              maxWidth: 960,
            }}
          >
            {person.name}
          </div>
          <div
            style={{
              color: "#bf1747",
              fontSize: 40,
              letterSpacing: -1.2,
              maxWidth: 960,
            }}
          >
            {person.title}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "flex", gap: 56 }}>
          {[
            ["+65%", "Organic traffic"],
            ["+30%", "Conversion rate"],
            ["+45%", "Core Web Vitals"],
            ["3+", "Years shipping"],
          ].map(([value, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: "#f4f2ec", fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>
                {value}
              </div>
              <div
                style={{
                  color: "rgba(244,242,236,0.45)",
                  fontSize: 20,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
