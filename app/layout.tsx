import type { Metadata } from "next";
import { Geist, Literata } from "next/font/google";
import { AppHeader } from "./ui/AppHeader";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Mon Ami — bilingual French reading",
  description:
    "Read books in French with aligned English translations and pronunciation.",
  openGraph: {
    title: "Mon Ami — bilingual French reading",
    description:
      "Read books in French with aligned English translations and pronunciation.",
    images: [{ url: "/meta.png", width: 1254, height: 1254 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/meta.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${literata.variable}`}>
      <body>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
