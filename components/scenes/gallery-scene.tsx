"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import InteractiveBentoGallery from "@/components/ui/interactive-bento-gallery";
import { useLanguage } from "@/lib/i18n";
import { useSceneProgress } from "@/lib/use-scene-progress";
import { PROJECT_SPANS, isVideoUrl, type SiteContent } from "@/lib/content";

/** Pinned gallery: work tiles pop in large one by one and snap into their
    bento slots; once assembled the grid stays interactive, then fades out
    into the contact section. */
export function GalleryScene({ content }: { content: SiteContent }) {
  const { t, lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSceneProgress(ref);

  const assemble = useTransform(scrollYProgress, [0.02, 0.7], [0, 1]);
  const fadeOut = useTransform(scrollYProgress, [0.9, 1], [1, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  return (
    <div ref={ref} id="projects" className="relative h-[270vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-2">
        <motion.div
          style={{ opacity: fadeOut }}
          className="w-full"
        >
          <motion.div style={{ opacity: headingOpacity }}>
            <InteractiveBentoGallery
              title={t(content.projects.heading)}
              description={t(content.projects.subheading)}
              linkLabel={lang === "ar" ? "زيارة المشروع" : "Visit project"}
              assembleProgress={assemble}
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
