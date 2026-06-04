import app from "./api";

const port = Number(process.env.PORT ?? 3000);
const distDir = `${import.meta.dir}/../dist`;
const indexPath = `${distDir}/index.html`;

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);

    // API
    if (url.pathname.startsWith("/api")) {
      return app.fetch(request);
    }

    const clean = decodeURIComponent(url.pathname)
      .replace(/^\/+/, "")
      .replaceAll("..", "");

    // 1) Реальный статический файл (есть расширение): /assets/..., /og-image.png,
    //    /sitemap.xml, /robots.txt, /favicon.ico и т.д.
    if (clean.includes(".")) {
      const asset = Bun.file(`${distDir}/${clean}`);
      if (await asset.exists()) {
        return new Response(asset);
      }
    }

    // 2) Пререндеренный маршрут: /services/internet → dist/services/internet/index.html
    const pagePath = clean ? `${distDir}/${clean}/index.html` : indexPath;
    const page = Bun.file(pagePath);
    if (await page.exists()) {
      return new Response(page, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // 3) Фолбэк (неизвестный путь) — корневой index.html, 404 отрисует клиент.
    const index = Bun.file(indexPath);
    if (await index.exists()) {
      return new Response(index, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Build output not found. Run `bun run build` first.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
});

console.log(`Web server listening on http://localhost:${server.port}`);
