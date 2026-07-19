import type { Env } from "../worker/env";
import type { TranslationMetadata } from "../lib/types";
import { getCachedMetadata, setCachedMetadata } from "../worker/cache";
import { fetchAllMetadata } from "../worker/r2";

/** Load metadata from cache or refresh from R2. */
async function getMetadata(env: Env): Promise<TranslationMetadata[]> {
  const cached = await getCachedMetadata(env);
  if (cached) return cached;

  const fresh = await fetchAllMetadata(env);
  await setCachedMetadata(env, fresh);
  return fresh;
}

/** GET /api/translations — return all translations. */
export async function handleGetTranslations(env: Env): Promise<Response> {
  const data = await getMetadata(env);
  return Response.json(data);
}

/** GET /api/translation/:id — return metadata for one translation. */
export async function handleGetTranslation(
  env: Env,
  id: string
): Promise<Response> {
  const data = await getMetadata(env);
  const entry = data.find((t) => t.id === id);

  if (!entry) {
    return Response.json({ error: "Translation not found" }, { status: 404 });
  }

  return Response.json(entry);
}

