"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { PoemAnimation } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/neon-button";
import { useLanguage } from "@/lib/i18n";
import { useSceneProgress } from "@/lib/use-scene-progress";
import { poemToHTML, type SiteContent } from "@/lib/content";

/** Pinned hero: scrolling zooms into the screen in front of the girl,
    then hands off to the About scene. */
export function HeroScene({ content }: { content: SiteContent }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSceneProgress(ref);

  const copyOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.22], [0, 40]);

  return (
    <div ref={ref} id="home" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <PoemAnimation
          poemHTML={poemToHTML(t(content.hero.poem))}
          backgroundImageUrl={content.hero.backgroundImageUrl || undefined}
          girlImageUrl={content.hero.girlImageUrl || undefined}
          zoomProgress={scrollYProgress}
        >
          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
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
            <ArrowDown className="mt-6 h-5 w-5 animate-bounce text-white/50" />
          </motion.div>
        </PoemAnimation>
      </div>
    </div>
  );
}
