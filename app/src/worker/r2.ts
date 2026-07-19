import type { Env } from "./env";
import type { TranslationMetadata } from "../lib/types";

/**
 * List all .zip objects in the bucket with custom metadata included inline.
 * Uses the `include: ["customMetadata"]` option so list() returns metadata
 * directly — no head() calls needed.
 */
export async function fetchAllMetadata(
  env: Env
): Promise<TranslationMetadata[]> {
  const translations: TranslationMetadata[] = [];
  let cursor: string | undefined;

  do {
    const listed = await env.TRANSLATIONS.list({
      cursor,
      include: ["customMetadata"],
    } as R2ListOptions & { include: string[] });

    for (const obj of listed.objects) {
      if (!obj.key.endsWith(".zip")) continue;
      const meta = obj.customMetadata ?? {};
      const id = obj.key.replace(/\.zip$/, "");

      translations.push({
        id,
        lang: meta["lang"] ?? id,
        lang_en: meta["lang_en"] ?? "",
        title: meta["title"] ?? "",
        description: meta["description"] ?? "",
        domain: meta["domain"] ?? "",
        copyright: meta["copyright"] ?? "",
        contents: meta["contents"] ?? "",
        size: obj.size,
      });
    }

    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return translations;
}
