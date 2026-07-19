/** HTML shell for the SPA. JS/CSS at /assets/* are served as static files by the platform. */
export const SPA_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Translations</title>
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>`;
