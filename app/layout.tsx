import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { AppHeader } from "./ui/AppHeader";
import { AuthProvider } from "./providers/auth";
import "./globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["200", "400", "500", "600"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider session={session}>
          <AppHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
