import type { Metadata } from "next";
import { Cairo, Geist } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import "./globals.css";

// Milan Display Black Swashes (provided by Salsabil): Arabic + Latin + digits,
// a single Black weight. The range makes it serve every CSS weight so the
// browser never fakes a bold on top of it.
const zain = localFont({
  variable: "--font-zain",
  src: [{ path: "./fonts/milan-black.woff2", weight: "100 900" }],
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
