"use client";

import React, { useEffect, useRef } from "react";

export interface PoemAnimationProps {
  poemHTML: string;
  backgroundImageUrl?: string;
  girlImageUrl?: string;
  children?: React.ReactNode;
}

/**
 * Renders the 3D poem animation hero section: a rotating glass cube with
 * scrolling text faces, a floating girl silhouette and an animated hue overlay.
 */
export const PoemAnimation = ({
  poemHTML,
  backgroundImageUrl,
  girlImageUrl,
  children,
}: PoemAnimationProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // This effect handles the responsive scaling of the animation container.
  useEffect(() => {
    function adjustContentSize() {
      if (contentRef.current) {
        const viewportWidth = window.innerWidth;
        const baseWidth = 1000;
        const scaleFactor =
          viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
        contentRef.current.style.transform = `scale(${scaleFactor})`;
      }
    }

    adjustContentSize();
    window.addEventListener("resize", adjustContentSize);
    return () => window.removeEventListener("resize", adjustContentSize);
  }, []);

  return (
    <header className="hero-section" id="home">
      <div className="container">
        <div
          ref={contentRef}
          className="content"
          style={{ display: "block", width: "1000px", height: "620px" }}
        >
          <div className="container-full">
            <div className="animated hue"></div>
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
            {girlImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="girlImage"
                src={girlImageUrl}
                alt="Silhouette of a girl with flowing hair"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}

            <div className="container">
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
            </div>

            <div className="container-reflect">
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
            </div>

            {children ? <div className="hero-copy">{children}</div> : null}
          </div>
        </div>
      </div>
    </header>
  );
};
