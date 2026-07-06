import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { SiteContent, defaultContent } from "./content";

const CONTENT_KEY = "site-content";
const LOCAL_FILE = path.join(process.cwd(), "content", "site-content.json");

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

/** Deep-merge stored content over defaults so new fields never break old data. */
function withDefaults(stored: unknown): SiteContent {
  function merge<T>(base: T, patch: unknown): T {
    if (
      patch === null ||
      patch === undefined ||
      typeof base !== typeof patch ||
      Array.isArray(base) !== Array.isArray(patch)
    ) {
      return base;
    }
    if (Array.isArray(base)) {
      return patch as T;
    }
    if (typeof base === "object" && base !== null) {
      const result: Record<string, unknown> = {
        ...(base as Record<string, unknown>),
      };
      for (const key of Object.keys(patch as Record<string, unknown>)) {
        const patchValue = (patch as Record<string, unknown>)[key];
        if (key in result) {
          result[key] = merge(result[key], patchValue);
        } else {
          result[key] = patchValue;
        }
      }
      return result as T;
    }
    return patch as T;
  }
  return merge(structuredClone(defaultContent), stored);
}

export async function getContent(): Promise<SiteContent> {
  const redis = getRedis();
  if (redis) {
    try {
      const stored = await redis.get(CONTENT_KEY);
      if (stored) return withDefaults(stored);
    } catch (error) {
      console.error("content-store: redis read failed", error);
    }
    return structuredClone(defaultContent);
  }

  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return withDefaults(JSON.parse(raw));
  } catch {
    return structuredClone(defaultContent);
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(CONTENT_KEY, content);
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(content, null, 2), "utf8");
}
