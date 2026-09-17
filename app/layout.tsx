import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { site, links, photo } from "@/data/content";
import "./globals.css";

const display = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  weight: "200 700",
  display: "swap",
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.shortName}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Harshvardhan Pandey",
    "Harsh Pandey",
    "Mumbai",
    "IIM Udaipur",
    "MBA",
    "venture capital analyst",
    "Putri Innovations",
    "computer engineer",
    "vibe coder",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so the saved theme never flashes.
const themeScript = `(()=>{try{var t=localStorage.getItem('hp-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  image: `${site.url}${photo.src}`,
  jobTitle: "MBA Candidate, IIM Udaipur",
  alumniOf: ["Indian Institute of Management Udaipur", "Thakur College of Engineering and Technology"],
  worksFor: { "@type": "Organization", name: "Putri Innovations Pvt. Ltd." },
  homeLocation: { "@type": "Place", name: `${site.hometown}, India` },
  address: { "@type": "PostalAddress", addressLocality: "Udaipur", addressCountry: "IN" },
  email: `mailto:${links.email}`,
  telephone: links.phone,
  sameAs: [links.linkedin, links.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        {children}
        <Analytics />
        {plausible ? (
          <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
