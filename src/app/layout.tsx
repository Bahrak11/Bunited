import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bunited | Your Gateway to Studying in Türkiye",
    template: "%s | Bunited",
  },
  description:
    "Bunited helps international students discover and apply to universities across Türkiye. Expert guidance, scholarship support, and end-to-end application services.",
  keywords: [
    "study in Turkey",
    "Turkish universities",
    "international students",
    "Türkiye scholarships",
    "university application",
  ],
  openGraph: {
    title: "Bunited | Your Gateway to Studying in Türkiye",
    description:
      "Expert education consultancy helping international students study at top Turkish universities.",
    type: "website",
    locale: "en_US",
    siteName: "Bunited",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bunited | Your Gateway to Studying in Türkiye",
    description:
      "Expert education consultancy helping international students study at top Turkish universities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
