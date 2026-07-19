import type { TranslationMetadata } from "./types";

/** Fetch all translations from the API. */
export async function fetchTranslations(): Promise<TranslationMetadata[]> {
  const res = await fetch("/api/translations");
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status}`);
  }
  return res.json();
}

/** Fetch a single translation by ID. */
export async function fetchTranslation(
  id: string
): Promise<TranslationMetadata> {
  const res = await fetch(`/api/translation/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch translation: ${res.status}`);
  }
  return res.json();
}
