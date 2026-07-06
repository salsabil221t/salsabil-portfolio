"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import type { SiteContent } from "@/lib/content";

export function Navbar({ content }: { content: SiteContent }) {
  const { t, lang } = useLanguage();

  const links = [
    { href: "#about", label: t(content.about.heading) },
    { href: "#skills", label: t(content.skills.heading) },
    { href: "#projects", label: t(content.projects.heading) },
    { href: "#contact", label: t(content.contact.heading) },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="#home"
          className="text-lg font-extrabold tracking-wide text-white drop-shadow"
        >
          {t(content.siteName)}
          <span className="text-sky">.</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-sky"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/admin"
            className="hidden text-xs text-white/50 transition-colors hover:text-sky md:block"
          >
            {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
