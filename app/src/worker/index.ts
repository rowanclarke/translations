import type { Env } from "./env";
import {
  handleGetTranslations,
  handleGetTranslation,
} from "../api/routes";
import { SPA_HTML } from "./spa";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // GET /badge — status badge SVG
    if (path === "/badge") {
      const object = await env.TRANSLATIONS.get("status.svg");
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(object.body, {
        headers: {
          "Content-Type": "image/svg+xml; charset=utf-8",
          "Cache-Control": "public, max-age=60",
          "Last-Modified": object.uploaded.toUTCString(),
          "ETag": object.httpEtag,
        },
      });
    }

    // GET /download?id=... — stream ZIP from R2
    if (path === "/download") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response("Missing id", { status: 400 });
      }
      const filename = `${id}.zip`;
      const object = await env.TRANSLATIONS.get(filename);
      if (!object) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(object.body, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // API routes
    if (path === "/api/translations") {
      return handleGetTranslations(env);
    }

    const translationMatch = path.match(/^\/api\/translation\/([^/]+)$/);
    if (translationMatch) {
      return handleGetTranslation(env, translationMatch[1]);
    }

    // SPA fallback — return the HTML shell for client-side routing
    return new Response(SPA_HTML, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
} satisfies ExportedHandler<Env>;
