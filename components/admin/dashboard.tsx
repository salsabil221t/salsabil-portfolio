"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Localized, ProjectSize, SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { resizeImageFile } from "@/lib/image-resize";

const PROJECT_SIZE_OPTIONS: { value: ProjectSize; label: string }[] = [
  { value: "small", label: "صغير (1×2)" },
  { value: "tall", label: "طويل (1×3)" },
  { value: "wide", label: "عريض (2×2)" },
  { value: "large", label: "كبير (2×3)" },
];

/* ---------- small form primitives ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold">{label}</label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-accent";

function LocalizedInput({
  value,
  onChange,
  multiline = false,
}: {
  value: Localized;
  onChange: (next: Localized) => void;
  multiline?: boolean;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {(["ar", "en"] as const).map((lang) =>
        multiline ? (
          <textarea
            key={lang}
            dir={lang === "ar" ? "rtl" : "ltr"}
            rows={4}
            value={value[lang]}
            placeholder={lang === "ar" ? "بالعربية" : "In English"}
            onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            className={inputClass}
          />
        ) : (
          <input
            key={lang}
            dir={lang === "ar" ? "rtl" : "ltr"}
            value={value[lang]}
            placeholder={lang === "ar" ? "بالعربية" : "In English"}
            onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
            className={inputClass}
          />
        )
      )}
    </div>
  );
}

/** URL field with an "upload from device" option — files are resized and
    stored as data URLs, so no separate file host is needed. */
function ImageInput({
  value,
  onChange,
  urlPlaceholder = "https://...",
}: {
  value: string;
  onChange: (next: string) => void;
  urlPlaceholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const isUploaded = value.startsWith("data:");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("لازم تختاري ملف صورة");
      return;
    }
    setError("");
    try {
      onChange(await resizeImageFile(file));
    } catch {
      setError("تعذّر تحميل الصورة، جربي صورة تانية");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isUploaded ? (
          <div className="flex-1 rounded-xl border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
            صورة مرفوعة من جهازك
          </div>
        ) : (
          <input
            dir="ltr"
            value={value}
            placeholder={urlPlaceholder}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputClass, "flex-1")}
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-dashed border-accent/60 px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          <Upload className="h-4 w-4" /> رفع صورة
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-20 w-32 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="حذف الصورة"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-3xl border border-border bg-card/60 p-6 shadow-sm">
      <h2 className="text-lg font-extrabold">
        {title}
        <span className="text-accent">.</span>
      </h2>
      {children}
    </section>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/60 px-4 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="حذف"
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

/* ---------- dashboard ---------- */

const TABS = [
  { id: "hero", label: "الهيرو" },
  { id: "about", label: "عني" },
  { id: "skills", label: "المهارات" },
  { id: "projects", label: "الأعمال" },
  { id: "contact", label: "التواصل" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Dashboard({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [tab, setTab] = useState<TabId>("hero");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function update(mutate: (draft: SiteContent) => void) {
    setContent((prev) => {
      const draft = structuredClone(prev);
      mutate(draft);
      return draft;
    });
    setStatus("idle");
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      setStatus(res.ok ? "saved" : "error");
      if (res.ok) router.refresh();
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <h1 className="text-lg font-extrabold">
            لوحة التحكم<span className="text-accent">.</span>
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent"
            >
              <ExternalLink className="h-4 w-4" /> عرض الموقع
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-1.5 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : status === "saved" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "جارٍ الحفظ..." : status === "saved" ? "تم الحفظ" : "حفظ"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="تسجيل الخروج"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* tabs */}
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {status === "error" ? (
        <div className="mx-auto mt-4 max-w-5xl px-4">
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
            لم يتم الحفظ — تأكدي أنك مسجلة الدخول وحاولي مرة أخرى.
          </p>
        </div>
      ) : null}

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {tab === "hero" ? (
          <SectionCard title="قسم الهيرو">
            <Field label="اسم الموقع (يظهر في الشريط العلوي)">
              <LocalizedInput
                value={content.siteName}
                onChange={(v) => update((d) => (d.siteName = v))}
              />
            </Field>
            <Field label="التحية">
              <LocalizedInput
                value={content.hero.greeting}
                onChange={(v) => update((d) => (d.hero.greeting = v))}
              />
            </Field>
            <Field label="الاسم">
              <LocalizedInput
                value={content.hero.name}
                onChange={(v) => update((d) => (d.hero.name = v))}
              />
            </Field>
            <Field label="الوصف المختصر">
              <LocalizedInput
                value={content.hero.tagline}
                onChange={(v) => update((d) => (d.hero.tagline = v))}
              />
            </Field>
            <Field
              label="نص المكعب المتحرك"
              hint="ضعي الكلمة بين نجمتين *هكذا* لتظهر مضيئة"
            >
              <LocalizedInput
                multiline
                value={content.hero.poem}
                onChange={(v) => update((d) => (d.hero.poem = v))}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="الزر الأساسي">
                <LocalizedInput
                  value={content.hero.ctaPrimary}
                  onChange={(v) => update((d) => (d.hero.ctaPrimary = v))}
                />
              </Field>
              <Field label="الزر الثانوي">
                <LocalizedInput
                  value={content.hero.ctaSecondary}
                  onChange={(v) => update((d) => (d.hero.ctaSecondary = v))}
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="صورة البنت"
                hint="ارفعي صورة من جهازك، أو الصقي رابط صورة أخرى"
              >
                <ImageInput
                  value={content.hero.girlImageUrl}
                  onChange={(v) => update((d) => (d.hero.girlImageUrl = v))}
                />
              </Field>
              <Field
                label="صورة الخلفية (اختياري)"
                hint="اتركيها فارغة لاستخدام التدرج اللوني"
              >
                <ImageInput
                  value={content.hero.backgroundImageUrl}
                  onChange={(v) =>
                    update((d) => (d.hero.backgroundImageUrl = v))
                  }
                />
              </Field>
            </div>
          </SectionCard>
        ) : null}

        {tab === "about" ? (
          <SectionCard title="قسم عني">
            <Field label="العنوان">
              <LocalizedInput
                value={content.about.heading}
                onChange={(v) => update((d) => (d.about.heading = v))}
              />
            </Field>
            <Field label="النبذة">
              <LocalizedInput
                multiline
                value={content.about.body}
                onChange={(v) => update((d) => (d.about.body = v))}
              />
            </Field>
            <Field label="نقاط مميزة">
              <div className="space-y-3">
                {content.about.highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1">
                      <LocalizedInput
                        value={highlight}
                        onChange={(v) =>
                          update((d) => (d.about.highlights[i] = v))
                        }
                      />
                    </div>
                    <RemoveButton
                      onClick={() =>
                        update((d) => d.about.highlights.splice(i, 1))
                      }
                    />
                  </div>
                ))}
                <AddButton
                  label="إضافة نقطة"
                  onClick={() =>
                    update((d) => d.about.highlights.push({ ar: "", en: "" }))
                  }
                />
              </div>
            </Field>
          </SectionCard>
        ) : null}

        {tab === "skills" ? (
          <SectionCard title="قسم المهارات">
            <Field label="العنوان">
              <LocalizedInput
                value={content.skills.heading}
                onChange={(v) => update((d) => (d.skills.heading = v))}
              />
            </Field>
            <div className="space-y-4">
              {content.skills.items.map((skill, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4"
                >
                  <div className="min-w-64 flex-1">
                    <LocalizedInput
                      value={skill.name}
                      onChange={(v) =>
                        update((d) => (d.skills.items[i].name = v))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={skill.level}
                      onChange={(e) =>
                        update(
                          (d) =>
                            (d.skills.items[i].level = Number(e.target.value))
                        )
                      }
                      className="w-32 accent-[var(--accent)]"
                    />
                    <span className="w-10 text-sm font-semibold">
                      {skill.level}%
                    </span>
                  </div>
                  <RemoveButton
                    onClick={() => update((d) => d.skills.items.splice(i, 1))}
                  />
                </div>
              ))}
              <AddButton
                label="إضافة مهارة"
                onClick={() =>
                  update((d) =>
                    d.skills.items.push({
                      name: { ar: "", en: "" },
                      level: 70,
                    })
                  )
                }
              />
            </div>
          </SectionCard>
        ) : null}

        {tab === "projects" ? (
          <SectionCard title="قسم الأعمال">
            <Field label="العنوان">
              <LocalizedInput
                value={content.projects.heading}
                onChange={(v) => update((d) => (d.projects.heading = v))}
              />
            </Field>
            <Field label="العنوان الفرعي">
              <LocalizedInput
                value={content.projects.subheading}
                onChange={(v) => update((d) => (d.projects.subheading = v))}
              />
            </Field>
            <div className="space-y-4">
              {content.projects.items.map((project, i) => (
                <div
                  key={i}
                  className="space-y-4 rounded-2xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">
                      مشروع {i + 1}
                    </span>
                    <RemoveButton
                      onClick={() =>
                        update((d) => d.projects.items.splice(i, 1))
                      }
                    />
                  </div>
                  <Field label="اسم المشروع">
                    <LocalizedInput
                      value={project.title}
                      onChange={(v) =>
                        update((d) => (d.projects.items[i].title = v))
                      }
                    />
                  </Field>
                  <Field label="الوصف">
                    <LocalizedInput
                      multiline
                      value={project.description}
                      onChange={(v) =>
                        update((d) => (d.projects.items[i].description = v))
                      }
                    />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="صورة / فيديو المشروع"
                      hint="ارفعي صورة من جهازك، أو الصقي رابط صورة أو رابط .mp4 لفيديو يتشغّل تلقائيًا"
                    >
                      <ImageInput
                        value={project.image}
                        onChange={(v) =>
                          update((d) => (d.projects.items[i].image = v))
                        }
                      />
                    </Field>
                    <Field label="مقاس القطعة في الجاليري">
                      <select
                        value={project.size}
                        onChange={(e) =>
                          update(
                            (d) =>
                              (d.projects.items[i].size = e.target
                                .value as ProjectSize)
                          )
                        }
                        className={inputClass}
                      >
                        {PROJECT_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="رابط المشروع">
                      <input
                        dir="ltr"
                        value={project.link}
                        placeholder="https://..."
                        onChange={(e) =>
                          update(
                            (d) => (d.projects.items[i].link = e.target.value)
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="الوسوم (مفصولة بفاصلة)">
                      <input
                        dir="ltr"
                        value={project.tags.join(", ")}
                        placeholder="UI, Web"
                        onChange={(e) =>
                          update(
                            (d) =>
                              (d.projects.items[i].tags = e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean))
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              ))}
              <AddButton
                label="إضافة مشروع"
                onClick={() =>
                  update((d) =>
                    d.projects.items.push({
                      title: { ar: "", en: "" },
                      description: { ar: "", en: "" },
                      tags: [],
                      link: "",
                      image: "",
                      size: "small",
                    })
                  )
                }
              />
            </div>
          </SectionCard>
        ) : null}

        {tab === "contact" ? (
          <SectionCard title="قسم التواصل">
            <Field label="العنوان">
              <LocalizedInput
                value={content.contact.heading}
                onChange={(v) => update((d) => (d.contact.heading = v))}
              />
            </Field>
            <Field label="العنوان الفرعي">
              <LocalizedInput
                value={content.contact.subheading}
                onChange={(v) => update((d) => (d.contact.subheading = v))}
              />
            </Field>
            <Field label="البريد الإلكتروني">
              <input
                dir="ltr"
                type="email"
                value={content.contact.email}
                onChange={(e) =>
                  update((d) => (d.contact.email = e.target.value))
                }
                className={inputClass}
              />
            </Field>
            <Field label="روابط التواصل الاجتماعي">
              <div className="space-y-3">
                {content.contact.socials.map((social, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      dir="ltr"
                      value={social.label}
                      placeholder="LinkedIn"
                      onChange={(e) =>
                        update(
                          (d) => (d.contact.socials[i].label = e.target.value)
                        )
                      }
                      className={cn(inputClass, "max-w-40")}
                    />
                    <input
                      dir="ltr"
                      value={social.url}
                      placeholder="https://..."
                      onChange={(e) =>
                        update(
                          (d) => (d.contact.socials[i].url = e.target.value)
                        )
                      }
                      className={inputClass}
                    />
                    <RemoveButton
                      onClick={() =>
                        update((d) => d.contact.socials.splice(i, 1))
                      }
                    />
                  </div>
                ))}
                <AddButton
                  label="إضافة رابط"
                  onClick={() =>
                    update((d) =>
                      d.contact.socials.push({ label: "", url: "" })
                    )
                  }
                />
              </div>
            </Field>
            <Field label="نص الفوتر">
              <LocalizedInput
                value={content.footer.text}
                onChange={(v) => update((d) => (d.footer.text = v))}
              />
            </Field>
          </SectionCard>
        ) : null}
      </main>
    </div>
  );
}
