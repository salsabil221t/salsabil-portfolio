"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";

export interface PoemAnimationProps {
  poemHTML: string;
  backgroundImageUrl?: string;
  girlImageUrl?: string;
  children?: React.ReactNode;
  /** 0→1 scroll progress: zooms into the screen in front of the girl. */
  zoomProgress?: MotionValue<number>;
}

const BASE_WIDTH = 1000;
const BASE_HEIGHT = 562;

/**
 * Renders the 3D poem animation hero: a glowing room seen from the inside,
 * giant text scrolling across its walls, a neon-framed ceiling, a reflective
 * floor and a girl silhouette standing at the center. The scene's hue slowly
 * shifts over time.
 */
export const PoemAnimation = ({
  poemHTML,
  backgroundImageUrl,
  girlImageUrl,
  children,
  zoomProgress,
}: PoemAnimationProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll-driven zoom into the back wall (the "screen" facing the girl).
  const stillMV = useMotionValue(0);
  const zoomMV = zoomProgress ?? stillMV;
  const zoomScale = useTransform(zoomMV, [0.12, 1], [1, 3.4]);
  const zoomOpacity = useTransform(zoomMV, [0.72, 0.98], [1, 0]);

  // Scale the fixed-size scene to the viewport and collapse the leftover
  // layout height so content below stays snug.
  useEffect(() => {
    function adjustContentSize() {
      if (!contentRef.current) return;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // Fit by width, but also leave room for the copy under the scene.
      const byWidth =
        viewportWidth < BASE_WIDTH + 40
          ? (viewportWidth / BASE_WIDTH) * 0.92
          : 1;
      const byHeight = Math.max(0.45, (viewportHeight - 330) / BASE_HEIGHT);
      const scaleFactor = Math.min(byWidth, byHeight, 1);
      contentRef.current.style.transform = `scale(${scaleFactor})`;
      contentRef.current.style.marginBottom = `${-BASE_HEIGHT * (1 - scaleFactor)}px`;
    }

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, []);

  const cube = (
    <div className="cube">
      <div className="face top"></div>
      <div className="face bottom"></div>
      <div
        className="face left text"
        dangerouslySetInnerHTML={{ __html: poemHTML }}
      ></div>
      <div
        className="face right text"
        dangerouslySetInnerHTML={{ __html: poemHTML }}
      ></div>
      <div className="face front"></div>
      <div
        className="face back text"
        dangerouslySetInnerHTML={{ __html: poemHTML }}
      ></div>
    </div>
  );

  return (
    <header className="hero-section">
      <div
        ref={contentRef}
        className="content"
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transformOrigin: "center top",
        }}
      >
        <motion.div
          className="container-full"
          style={{
            scale: zoomScale,
            opacity: zoomOpacity,
            transformOrigin: "50% 42%",
          }}
        >
          {backgroundImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="backgroundImage"
              src={backgroundImageUrl}
              alt=""
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div className="container">{cube}</div>
          <div className="container-reflect">{cube}</div>

          {girlImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="girlImage"
              src={girlImageUrl}
              alt="Silhouette of a girl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}

          <div className="animated hue"></div>
        </motion.div>
      </div>

      {children ? <div className="hero-copy">{children}</div> : null}
    </header>
  );
};
