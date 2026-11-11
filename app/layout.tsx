import type { Metadata } from "next";
import { Almarai, Libre_Baskerville } from "next/font/google";
import "./globals.css";

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
  title: "Travel Concierge & Custom Itineraries | Curated x Catalina",
  description:
    "Thoughtful itineraries, trusted recommendations, and meticulous planning for travelers who value exceptional experiences over ordinary trips.",
  applicationName: "Curated x Catalina",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
  openGraph: {
    title: "Travel Concierge & Custom Itineraries | Curated x Catalina",
    description:
      "Explore personalized travel services, curated itineraries, and expert guidance for memorable journeys, especially in Thailand.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
