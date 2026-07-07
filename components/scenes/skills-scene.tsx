"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useSceneProgress } from "@/lib/use-scene-progress";
import type { SiteContent, SkillItem } from "@/lib/content";

function SkillCard({
  progress,
  skill,
  start,
  width,
  isLast,
  label,
}: {
  progress: MotionValue<number>;
  skill: SkillItem;
  start: number;
  width: number;
  isLast: boolean;
  label: string;
}) {
  const appear = useTransform(progress, [start, start + width * 0.35], [0, 1]);
  const y = useTransform(progress, [start, start + width * 0.35], [50, 0]);

  // the card "fills up" to the skill's percentage
  const fillTarget = Math.max(0, Math.min(100, skill.level));
  const fill = useTransform(
    progress,
    [start + width * 0.25, start + width],
    [0, fillTarget]
  );
  const fillHeight = useTransform(fill, (v) => `${v}%`);

  const [counter, setCounter] = useState(0);
  useMotionValueEvent(fill, "change", (v) => setCounter(Math.round(v)));

  // the LAST card grows at the end of the scene, opening into the gallery;
  // every OTHER card (and the heading) fades away while it grows, so the
  // zoom hands off straight to the gallery.
  const grow = useTransform(
    progress,
    isLast ? [0.78, 1] : [0, 1],
    isLast ? [1, 13] : [1, 1]
  );
  const growFade = useTransform(
    progress,
    isLast ? [0.9, 0.99] : [0.78, 0.87],
    isLast ? [1, 0] : [1, 0]
  );
  const opacity = useTransform([appear, growFade], (values: number[]) => {
    const [a, b] = values;
    return a * b;
  });

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale: grow,
        zIndex: isLast ? 30 : 1,
      }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-lg"
    >
      {/* rising fill */}
      <motion.div
        style={{ height: fillHeight }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue/35 via-sky/25 to-transparent"
      />
      <div className="relative flex items-end justify-between gap-4">
        <h3 className="text-xl font-extrabold md:text-2xl">{label}</h3>
        <span className="text-4xl font-black text-accent md:text-5xl">
          {counter}
          <span className="text-lg font-bold">%</span>
        </span>
      </div>
    </motion.div>
  );
}

/** Pinned Skills: cards slide in and fill up to their percentage; the
    last card then grows to fill the screen, opening into the gallery. */
export function SkillsScene({ content }: { content: SiteContent }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSceneProgress(ref);

  const skills = content.skills.items;
  const bandStart = 0.08;
  const bandTotal = 0.62;
  const width = skills.length ? bandTotal / skills.length : bandTotal;

  // fades in at the start, fades away while the last card grows
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.07, 0.78, 0.87],
    [0, 1, 1, 0]
  );
  const headingY = useTransform(scrollYProgress, [0, 0.07], [30, 0]);

  return (
    <div ref={ref} id="skills" className="relative h-[320vh] bg-background">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <motion.h2
          style={{ opacity: headingOpacity, y: headingY }}
          className="mb-10 text-3xl font-extrabold md:text-5xl"
        >
          {t(content.skills.heading)}
          <span className="text-accent">.</span>
        </motion.h2>

        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
          {skills.map((skill, i) => (
            <SkillCard
              key={i}
              progress={scrollYProgress}
              skill={skill}
              start={bandStart + i * width}
              width={width}
              isLast={i === skills.length - 1}
              label={t(skill.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
