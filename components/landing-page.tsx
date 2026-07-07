"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail, Sparkles } from "lucide-react";
import { PoemAnimation } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/neon-button";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { Navbar } from "@/components/navbar";
import { Reveal } from "@/components/reveal";
import { useLanguage } from "@/lib/i18n";
import {
  PROJECT_SPANS,
  isVideoUrl,
  poemToHTML,
  type SiteContent,
} from "@/lib/content";

export function LandingPage({ content }: { content: SiteContent }) {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar content={content} />

      {/* Hero */}
      <PoemAnimation
        poemHTML={poemToHTML(t(content.hero.poem))}
        backgroundImageUrl={content.hero.backgroundImageUrl || undefined}
        girlImageUrl={content.hero.girlImageUrl || undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <p className="mb-1 text-lg font-medium text-mint/90">
            {t(content.hero.greeting)}
          </p>
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {t(content.hero.name)}
            <span className="text-sky">.</span>
          </h1>
          <p className="mb-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t(content.hero.tagline)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#projects">
              <Button variant="solid" size="lg" className="font-semibold">
                {t(content.hero.ctaPrimary)}
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" className="font-semibold text-white">
                {t(content.hero.ctaSecondary)}
              </Button>
            </a>
          </div>
        </motion.div>
      </PoemAnimation>

      <div className="relative -mt-10 flex justify-center">
        <a
          href="#about"
          aria-label="Scroll down"
          className="z-10 flex h-10 w-10 animate-bounce items-center justify-center rounded-full border border-border bg-card text-accent shadow-lg"
        >
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
        <Reveal>
          <h2 className="mb-10 text-center text-3xl font-extrabold md:text-4xl">
            {t(content.about.heading)}
            <span className="text-accent">.</span>
          </h2>
        </Reveal>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t(content.about.body)}
            </p>
          </Reveal>
          <div className="space-y-4">
            {content.about.highlights.map((highlight, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-1">
                  <Sparkles className="h-5 w-5 shrink-0 text-accent" />
                  <span className="font-medium">{t(highlight)}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section
        id="skills"
        className="scroll-mt-24 border-y border-border bg-muted/50 py-24"
      >
        <div className="mx-auto max-w-4xl px-4">
          <Reveal>
            <h2 className="mb-12 text-center text-3xl font-extrabold md:text-4xl">
              {t(content.skills.heading)}
              <span className="text-accent">.</span>
            </h2>
          </Reveal>
          <div className="space-y-7">
            {content.skills.items.map((skill, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold">{t(skill.name)}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-border">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-navy via-blue to-sky"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2 + i * 0.08 }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects — interactive bento gallery */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
        <InteractiveBentoGallery
          title={t(content.projects.heading)}
          description={t(content.projects.subheading)}
          linkLabel={lang === "ar" ? "زيارة المشروع" : "Visit project"}
          mediaItems={content.projects.items.map((project, i) => ({
            id: i + 1,
            type: isVideoUrl(project.image || "") ? "video" : "image",
            title: t(project.title),
            desc: t(project.description),
            url: project.image || "",
            span: PROJECT_SPANS[project.size] || PROJECT_SPANS.small,
            link: project.link,
            tags: project.tags,
          }))}
        />
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="scroll-mt-24 bg-gradient-to-b from-navy to-blue py-24 text-white"
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
