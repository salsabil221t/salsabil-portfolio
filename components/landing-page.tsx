"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/neon-button";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { HeroScene } from "@/components/scenes/hero-scene";
import { AboutScene } from "@/components/scenes/about-scene";
import { SkillsScene } from "@/components/scenes/skills-scene";
import { GalleryScene } from "@/components/scenes/gallery-scene";
import { useLanguage } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

export function LandingPage({ content }: { content: SiteContent }) {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar content={content} />

      {/* Scroll-driven story: each scene pins to the screen and the
          scroll position drives its animation. */}
      <HeroScene content={content} />
      <AboutScene content={content} />
      <SkillsScene content={content} />
      <GalleryScene content={content} />

      {/* Contact */}
      <section
        id="contact"
        className="relative scroll-mt-24 bg-gradient-to-b from-navy to-blue py-24 text-white"
      >
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
              {t(content.contact.heading)}
              <span className="text-sky">.</span>
            </h2>
            <p className="mb-8 text-lg text-white/80">
              {t(content.contact.subheading)}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a href={`mailto:${content.contact.email}`}>
              <Button
                variant="solid"
                size="lg"
                className="inline-flex items-center gap-2 font-semibold"
              >
                <Mail className="h-4 w-4" />
                {content.contact.email}
              </Button>
            </a>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {content.contact.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url || "#"}
                  target={social.url && social.url !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  className="rounded-full border border-white/25 px-5 py-2 text-sm font-medium text-white/85 transition-all hover:scale-105 hover:border-sky hover:text-sky"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-6 text-center text-sm text-white/60 dark:bg-[#070a1c]">
        {t(content.footer.text)} · {new Date().getFullYear()}
        <span className="mx-2 text-white/25">|</span>
        <a href="/admin" className="hover:text-sky">
          {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
        </a>
      </footer>
    </div>
  );
}
