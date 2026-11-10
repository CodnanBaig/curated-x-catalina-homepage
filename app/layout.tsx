import type { Metadata } from "next";
import { Almarai, Libre_Baskerville } from "next/font/google";
import "./globals.css";

// Same families as the live curatedxcatalina.com site.
const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Almarai({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Curated x Catalina: Journeys, curated",
  description:
    "Custom itineraries and travel concierge for Thailand and beyond, planned by someone who lives there.",
  applicationName: "Curated x Catalina",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Curated x Catalina: Journeys, curated",
    description: "Custom itineraries and travel concierge for Thailand and beyond.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
