import { writable } from "svelte/store";

export type Route =
  | { page: "list" }
  | { page: "detail"; id: string };

function parseRoute(): Route {
  const path = window.location.pathname;
  const match = path.match(/^\/translation\/([^/]+)$/);
  if (match) {
    return { page: "detail", id: match[1] };
  }
  return { page: "list" };
}

export const route = writable<Route>(parseRoute());

/** Navigate to a new path without full page reload. */
export function navigate(path: string): void {
  window.history.pushState(null, "", path);
  route.set(parseRoute());
}

// Handle browser back/forward
window.addEventListener("popstate", () => {
  route.set(parseRoute());
});
