<script lang="ts">
  import { onMount } from "svelte";
  import type { TranslationMetadata } from "../lib/types";
  import { fetchTranslation } from "../lib/api";
  import { navigate } from "../lib/router";

  interface Props {
    id: string;
  }

  let { id }: Props = $props();

  let translation: TranslationMetadata | null = $state(null);
  let loading = $state(true);
  let error: string | null = $state(null);

  onMount(async () => {
    try {
      translation = await fetchTranslation(id);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load translation";
    } finally {
      loading = false;
    }
  });

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
</script>

<div class="detail">
  <button class="back" onclick={() => navigate("/")}>← Back to list</button>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {:else if translation}
    <div class="card">
      <h2>{translation.title || translation.id}</h2>

      <dl>
        <dt>Code</dt>
        <dd class="mono">{translation.id}</dd>

        <dt>Language</dt>
        <dd>{translation.lang}</dd>

        <dt>English Name</dt>
        <dd>{translation.lang_en || "—"}</dd>

        <dt>Title</dt>
        <dd>{translation.title || "—"}</dd>

        <dt>Description</dt>
        <dd>{translation.description || "—"}</dd>

        <dt>Domain</dt>
        <dd>{translation.domain || "—"}</dd>

        <dt>Copyright</dt>
        <dd>{translation.copyright || "—"}</dd>

        <dt>Contents</dt>
        <dd class="contents">{translation.contents || "—"}</dd>

        <dt>File Size</dt>
        <dd>{formatSize(translation.size)}</dd>
      </dl>

      <a href="/download?id={translation.id}" class="download-btn" download>
        Download ZIP
      </a>
    </div>
  {/if}
</div>

<style>
  .detail {
    max-width: 700px;
  }

  .back {
    display: inline-block;
    margin-bottom: 1rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    color: #0d6efd;
    background: none;
    border: 1px solid #0d6efd;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .back:hover {
    background: #0d6efd;
    color: #fff;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    color: #6c757d;
  }

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #dee2e6;
    border-top-color: #0d6efd;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c2c7;
    border-radius: 0.375rem;
    color: #842029;
  }

  .card {
    background: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .card h2 {
    margin: 0 0 1.25rem;
    font-size: 1.25rem;
  }

  dl {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 0.5rem 1rem;
    margin: 0 0 1.5rem;
  }

  dt {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.85rem;
  }

  dd {
    margin: 0;
    word-break: break-word;
  }

  .mono {
    font-family: "SF Mono", "Fira Code", monospace;
    font-size: 0.85rem;
  }

  .contents {
    white-space: pre-wrap;
  }

  .download-btn {
    display: inline-block;
    padding: 0.6rem 1.25rem;
    background: #0d6efd;
    color: #fff;
    text-decoration: none;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background 0.15s;
  }

  .download-btn:hover {
    background: #0b5ed7;
  }
</style>
