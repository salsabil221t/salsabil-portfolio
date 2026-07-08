import type { Metadata } from "next";
import { Cairo, Geist } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

// Zain (provided by Salsabil): Arabic-only glyphs, four real weight designs.
// The TTF metadata mislabels every file as 400, so weights are declared here.
// Ranges make CSS weight-matching sensible (e.g. bold 700 → the 600 design).
const zain = localFont({
  variable: "--font-zain",
  src: [
    { path: "./fonts/zain-100.woff2", weight: "100 200" },
    { path: "./fonts/zain-300.woff2", weight: "300 500" },
    { path: "./fonts/zain-600.woff2", weight: "600 700" },
    { path: "./fonts/zain-800.woff2", weight: "800 900" },
  ],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "سلسبيل · Salsabil",
  description: "Personal portfolio — بورتفوليو شخصي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${zain.variable} ${cairo.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
