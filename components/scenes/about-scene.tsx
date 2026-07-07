"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useSceneProgress } from "@/lib/use-scene-progress";
import type { Localized, SiteContent } from "@/lib/content";

function Highlight({
  progress,
  text,
  start,
  width,
  isLast,
}: {
  progress: MotionValue<number>;
  text: string;
  start: number;
  width: number;
  isLast: boolean;
}) {
  const opacity = useTransform(
    progress,
    [start, start + width * 0.3, start + width * 0.75, start + width],
    [0, 1, 1, isLast ? 1 : 0]
  );
  const y = useTransform(
    progress,
    [start, start + width * 0.3, start + width * 0.75, start + width],
    [36, 0, 0, isLast ? 0 : -36]
  );

  return (
    <motion.div
      style={{ opacity, y, gridArea: "1 / 1" }}
      className="flex items-center justify-center gap-3 rounded-3xl border border-border bg-card px-6 py-5 shadow-lg md:px-10 md:py-7"
    >
      <Sparkles className="h-6 w-6 shrink-0 text-accent" />
      <span className="text-lg font-semibold md:text-2xl">{text}</span>
    </motion.div>
  );
}

/** Pinned About: the body text types itself out, then the highlights
    appear one at a time, each replacing the previous one. */
export function AboutScene({ content }: { content: SiteContent }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSceneProgress(ref);

  const body = t(content.about.body);
  const [chars, setChars] = useState(0);

  const typing = useTransform(scrollYProgress, [0.08, 0.42], [0, 1]);
  useMotionValueEvent(typing, "change", (v) => {
    setChars(Math.round(Math.max(0, Math.min(1, v)) * body.length));
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.08], [30, 0]);

  const highlights = content.about.highlights;
  const bandStart = 0.5;
  const bandWidth = highlights.length
    ? 0.42 / highlights.length
    : 0.42;

  const doneTyping = chars >= body.length;

  return (
    <div ref={ref} id="about" className="relative h-[320vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <motion.h2
          style={{ opacity: headingOpacity, y: headingY }}
          className="mb-8 text-3xl font-extrabold md:text-5xl"
        >
          {t(content.about.heading)}
          <span className="text-accent">.</span>
        </motion.h2>

        {/* typewriter body */}
        <p
          dir="auto"
          className="mx-auto min-h-28 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground md:text-2xl"
        >
          {body.slice(0, chars)}
          {!doneTyping && chars > 0 ? (
            <span className="animate-pulse font-bold text-accent">|</span>
          ) : null}
        </p>

        {/* highlights, one at a time in the same slot */}
        <div className="mt-10 grid w-full max-w-xl place-items-center">
          {highlights.map((h: Localized, i: number) => (
            <Highlight
              key={i}
              progress={scrollYProgress}
              text={t(h)}
              start={bandStart + i * bandWidth}
              width={bandWidth}
              isLast={i === highlights.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
