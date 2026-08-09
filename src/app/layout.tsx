import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { person, summary } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rafsanraiyan.com";
const pageTitle = `${person.name} — ${person.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s — ${person.name}`,
  },
  description: summary,
  keywords: [
    "Rafsan Raiyan",
    "Full Stack Developer",
    "E-commerce Developer",
    "WooCommerce Developer",
    "Shopify Developer",
    "Next.js Developer",
    "Laravel Developer",
    "Technical SEO",
    "CRO",
    "Dhaka",
    "Bangladesh",
  ],
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: person.name,
    title: pageTitle,
    description: summary,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: summary,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0e",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.title,
  email: `mailto:${person.email}`,
  telephone: person.phone,
  url: siteUrl,
  image: `${siteUrl}${person.photo}`,
  description: summary,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  sameAs: person.socials.filter((s) => s.label !== "Email").map((s) => s.href),
  knowsAbout: [
    "Full-Stack Development",
    "E-Commerce Engineering",
    "WooCommerce",
    "Shopify",
    "Next.js",
    "Laravel",
    "Technical SEO",
    "Conversion Rate Optimisation",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Independent University, Bangladesh",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <Preloader />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
