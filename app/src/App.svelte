<script lang="ts">
  import { route, navigate } from "./lib/router";
  import TranslationList from "./components/TranslationList.svelte";
  import TranslationDetail from "./components/TranslationDetail.svelte";
</script>

<main>
  <header>
    <h1><a href="/" onclick={(e: MouseEvent) => { e.preventDefault(); navigate('/'); }}>Translations</a></h1>
    <a href="https://github.com/rowanclarke/translations" target="_blank" rel="noopener noreferrer" class="github-link">
      <svg viewBox="0 0 16 16" fill="currentColor" width="24" height="24"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
    </a>
  </header>

  {#if $route.page === "list"}
    <TranslationList />
  {:else if $route.page === "detail"}
    <TranslationDetail id={$route.id} />
  {/if}
</main>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    background: #f8f9fa;
    color: #212529;
    line-height: 1.5;
  }

  main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 1rem;
  }

  .github-link {
    color: #212529;
    transition: color 0.15s;
  }

  .github-link:hover {
    color: #0d6efd;
  }

  header h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  header h1 a {
    color: inherit;
    text-decoration: none;
  }

  header h1 a:hover {
    color: #0d6efd;
  }
</style>
