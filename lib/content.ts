export type Lang = "ar" | "en";

export type Localized = { ar: string; en: string };

export interface SkillItem {
  name: Localized;
  level: number; // 0-100
}

export type ProjectSize = "small" | "tall" | "wide" | "large";

export interface ProjectItem {
  title: Localized;
  description: Localized;
  tags: string[];
  link: string;
  /** Image URL, or a .mp4/.webm URL for video tiles. */
  image: string;
  size: ProjectSize;
}

/** Bento-grid span classes per tile size (4 columns on md, 60px rows).
    Base (mobile, 1 column) still needs row spans or tiles collapse to 60px. */
export const PROJECT_SPANS: Record<ProjectSize, string> = {
  small: "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2",
  tall: "col-span-1 row-span-3 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-3",
  wide: "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
  large: "col-span-2 row-span-3 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-3",
};

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteContent {
  siteName: Localized;
  hero: {
    greeting: Localized;
    name: Localized;
    tagline: Localized;
    /** Scrolling cube text. Wrap words in *asterisks* to highlight them. */
    poem: Localized;
    ctaPrimary: Localized;
    ctaSecondary: Localized;
    girlImageUrl: string;
    backgroundImageUrl: string;
  };
  about: {
    heading: Localized;
    body: Localized;
    highlights: Localized[];
  };
  skills: {
    heading: Localized;
    items: SkillItem[];
  };
  projects: {
    heading: Localized;
    subheading: Localized;
    items: ProjectItem[];
  };
  contact: {
    heading: Localized;
    subheading: Localized;
    email: string;
    socials: SocialLink[];
  };
  footer: {
    text: Localized;
  };
}

/** Escape HTML, then turn *word* into a highlighted <span>. */
export function poemToHTML(poem: string): string {
  const escaped = poem
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withSpans = escaped.replace(/\*([^*]+)\*/g, "<span>$1</span>");
  // Two identical halves + translateX(-50%) = a seamless marquee loop.
  const half = `${withSpans}  •  `;
  return `<p>${half}${half}</p>`;
}

export const defaultContent: SiteContent = {
  siteName: { ar: "سلسبيل", en: "Salsabil" },
  hero: {
    greeting: { ar: "أهلًا، أنا", en: "Hi, I'm" },
    name: { ar: "سلسبيل", en: "Salsabil" },
    tagline: {
      ar: "أحوّل الأفكار إلى تجارب رقمية جميلة",
      en: "I turn ideas into beautiful digital experiences",
    },
    poem: {
      ar: "أؤمن أن *الإبداع* يبدأ من فكرة صغيرة، ومع *الشغف* والإصرار تتحول إلى شيء يلمسه الناس. أحب *التصميم* والتفاصيل الدقيقة، وأسعى دائمًا إلى *التعلم* والتجربة. كل مشروع رحلة جديدة نحو *التميز*.",
      en: "I believe *creativity* starts with a small idea, and with *passion* and persistence it becomes something people can feel. I love *design* and fine details, and I always chase *learning* and experimenting. Every project is a new journey toward *excellence*.",
    },
    ctaPrimary: { ar: "شاهدي أعمالي", en: "View my work" },
    ctaSecondary: { ar: "تواصلي معي", en: "Get in touch" },
    girlImageUrl: "/girl-hero.png",
    backgroundImageUrl: "",
  },
  about: {
    heading: { ar: "عني", en: "About me" },
    body: {
      ar: "أنا سلسبيل، شغوفة بالتصميم والتقنية. أعمل على بناء تجارب رقمية تجمع بين الجمال والوظيفة، وأحب أن يكون لكل تفصيلة قصة ومعنى.",
      en: "I'm Salsabil, passionate about design and technology. I build digital experiences that balance beauty and function, and I love when every detail tells a story.",
    },
    highlights: [
      { ar: "تفكير إبداعي وحلول غير تقليدية", en: "Creative thinking and unconventional solutions" },
      { ar: "اهتمام بالتفاصيل الدقيقة", en: "Obsessed with the fine details" },
      { ar: "تعلم مستمر ومتابعة لكل جديد", en: "Always learning, always up to date" },
    ],
  },
  skills: {
    heading: { ar: "مهاراتي", en: "My skills" },
    items: [
      { name: { ar: "تصميم واجهات", en: "UI Design" }, level: 90 },
      { name: { ar: "تجربة المستخدم", en: "UX" }, level: 85 },
      { name: { ar: "تطوير الويب", en: "Web Development" }, level: 80 },
      { name: { ar: "الهوية البصرية", en: "Branding" }, level: 75 },
    ],
  },
  projects: {
    heading: { ar: "أعمالي", en: "My work" },
    subheading: {
      ar: "اسحبي القطع واستكشفي المشاريع — اضغطي على أي عمل لعرضه",
      en: "Drag the tiles and explore — click any project to view it",
    },
    items: [
      {
        title: { ar: "مشروع أول", en: "First project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["UI", "Web"],
        link: "#",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
        size: "wide",
      },
      {
        title: { ar: "مشروع ثاني", en: "Second project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["Branding"],
        link: "#",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&q=80",
        size: "tall",
      },
      {
        title: { ar: "مشروع ثالث", en: "Third project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["UX", "Mobile"],
        link: "#",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=700&q=80",
        size: "small",
      },
      {
        title: { ar: "مشروع رابع", en: "Fourth project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["Web"],
        link: "#",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=700&q=80",
        size: "small",
      },
      {
        title: { ar: "مشروع خامس", en: "Fifth project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["UI", "Design"],
        link: "#",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80",
        size: "large",
      },
      {
        title: { ar: "مشروع سادس", en: "Sixth project" },
        description: {
          ar: "وصف مختصر للمشروع — يمكنك تعديله من لوحة التحكم.",
          en: "A short project description — editable from the dashboard.",
        },
        tags: ["Mobile"],
        link: "#",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=80",
        size: "tall",
      },
    ],
  },
  contact: {
    heading: { ar: "تواصلي معي", en: "Get in touch" },
    subheading: {
      ar: "عندك فكرة أو مشروع؟ يسعدني أسمع منك.",
      en: "Have an idea or a project? I'd love to hear from you.",
    },
    email: "salsabilomran910@gmail.com",
    socials: [
      { label: "LinkedIn", url: "#" },
      { label: "GitHub", url: "#" },
      { label: "Instagram", url: "#" },
    ],
  },
  footer: {
    text: {
      ar: "صُنع بحب © سلسبيل",
      en: "Made with love © Salsabil",
    },
  },
};
