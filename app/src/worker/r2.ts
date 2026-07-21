import { decode } from "he";
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
        lang: decode(meta["lang"] ?? id),
        lang_en: decode(meta["lang_en"] ?? ""),
        title: decode(meta["title"] ?? ""),
        description: decode(meta["description"] ?? ""),
        domain: decode(meta["domain"] ?? ""),
        copyright: decode(meta["copyright"] ?? ""),
        contents: decode(meta["contents"] ?? ""),
        bcp47: decode(meta["bcp47"] ?? ""),
        size: obj.size,
      });
    }

    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return translations;
}
