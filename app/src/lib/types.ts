/** Full metadata for a single translation, read from R2 object custom metadata. */
export interface TranslationMetadata {
  /** Translation code (object key without .zip extension) */
  id: string;
  /** Language code (e.g. "aai") */
  lang: string;
  /** English name of the language */
  lang_en: string;
  /** Title of the translation */
  title: string;
  /** Description of the translation */
  description: string;
  /** Domain name of source */
  domain: string;
  /** Copyright notice */
  copyright: string;
  /** Contents listing */
  contents: string;
  /** Size of the ZIP file in bytes */
  size: number;
}

/** Summary used in list views — identical fields, kept as a distinct type for API clarity. */
export type TranslationSummary = TranslationMetadata;
