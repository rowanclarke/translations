<script lang="ts">
  import { onMount } from "svelte";
  import type { TranslationMetadata } from "../lib/types";
  import { fetchTranslations } from "../lib/api";
  import { navigate } from "../lib/router";

  let translations: TranslationMetadata[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let search = $state("");

  onMount(async () => {
    try {
      const raw = await fetchTranslations();
      translations = raw.map((t) => ({
        ...t,
        title: t.title,
        description: t.description,
        domain: t.domain,
        copyright: t.copyright,
        lang: t.lang,
        lang_en: t.lang_en,
        contents: t.contents,
      }));
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load translations";
    } finally {
      loading = false;
    }
  });

  const filtered = $derived.by(() => {
    const q = search.toLowerCase().trim();
    let result = translations;

    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.lang.toLowerCase().includes(q) ||
          t.lang_en.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => a.lang_en.localeCompare(b.lang_en));
  });

  function truncate(str: string, max: number): string {
    return str.length > max ? str.slice(0, max - 3) + "..." : str;
  }

  function langLabel(t: TranslationMetadata): string {
    return t.lang === t.lang_en ? t.lang : `${t.lang} (${t.lang_en})`;
  }

  function handleCardClick(id: string): void {
    navigate(`/translation/${id}`);
  }
</script>

<div class="controls">
  <input
    type="search"
    placeholder="Search translations..."
    bind:value={search}
    class="search-input"
  />
  <span class="count">{filtered.length} translation{filtered.length !== 1 ? "s" : ""}</span>
</div>

{#if loading}
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading translations...</p>
  </div>
{:else if error}
  <div class="error">
    <p>{error}</p>
  </div>
{:else}
  <div class="card-grid">
    {#each filtered as t (t.id)}
      <div class="card" onclick={() => handleCardClick(t.id)}>
        <h3 class="card-title">{t.title}</h3>
        <p class="card-description">{t.description}</p>
        <p class="card-subtext">{t.domain} - {t.copyright}</p>
        <div class="card-tags">
          <span class="tag">
            <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {langLabel(t)}
          </span>
          <span class="tag">
            <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            {truncate(t.contents, 20)}
          </span>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .search-input {
    flex: 1;
    min-width: 200px;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    outline: none;
    transition: border-color 0.15s;
  }

  .search-input:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
  }

  .count {
    font-size: 0.85rem;
    color: #6c757d;
    white-space: nowrap;
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

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1rem;
  }

  .card {
    background: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1.25rem;
    cursor: pointer;
    transition: box-shadow 0.15s, border-color 0.15s;
  }

  .card:hover {
    border-color: #86b7fe;
    box-shadow: 0 2px 8px rgba(13, 110, 253, 0.1);
  }

  .card-title {
    margin: 0 0 0.25rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #212529;
  }

  .card-description {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    color: #495057;
  }

  .card-subtext {
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.6rem;
    font-size: 0.78rem;
    background: #f0f4f8;
    border-radius: 1rem;
    color: #495057;
  }

  .tag-icon {
    width: 0.9rem;
    height: 0.9rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
