import type { Env } from "./env";
import type { TranslationMetadata } from "../lib/types";

const CACHE_KEY = "translations:all";

/** Retrieve cached metadata from KV, or return null if stale/missing. */
export async function getCachedMetadata(
  env: Env
): Promise<TranslationMetadata[] | null> {
  const raw = await env.CACHE.get(CACHE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as TranslationMetadata[];
  } catch {
    return null;
  }
}

/** Store metadata in KV with a TTL. */
export async function setCachedMetadata(
  env: Env,
  data: TranslationMetadata[]
): Promise<void> {
  const ttl = parseInt(env.CACHE_TTL_SECONDS, 10) || 3600;
  await env.CACHE.put(CACHE_KEY, JSON.stringify(data), {
    expirationTtl: ttl,
  });
}
