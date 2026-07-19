/** Cloudflare Worker environment bindings. */
export interface Env {
  TRANSLATIONS: R2Bucket;
  CACHE: KVNamespace;
  CACHE_TTL_SECONDS: string;
}
