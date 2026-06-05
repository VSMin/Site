// Build-time пререндер для KONNEKTEAM.
// Запускается из packages/web ПОСЛЕ `vite build` и `vite build --ssr ...`.
// Берёт собранный SSR-бандл, рендерит каждый маршрут в готовый HTML с контентом
// и пер-страничными мета-тегами, и заодно генерирует sitemap.xml.
//
// Запуск:  bun prerender.ts   (через npm-скрипт build, см. package.json)

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
// Данные сайта (чистые константы, без DOM) — для списка маршрутов и sitemap.
import { SERVICES, BLOG_POSTS } from "./src/web/lib/data";
// Собранный SSR-бандл (появляется после `vite build --ssr`). На этапе
// type-check его ещё нет, поэтому игнорируем тип — файл точно существует в рантайме.
// @ts-ignore — генерируется сборкой
import { render } from "./dist-ssr/entry-server.js";
import type { HeadMeta } from "./src/web/lib/seo";

const SITE = "https://konnekteam.kz";
const DIST = "dist";
const TITLE_SUFFIX = " | KONNEKTEAM — Уральск";

// Фолбэк, если у страницы нет <SEO> (например, /speedtest).
const FALLBACK_TITLE = "KONNEKTEAM — IT-услуги в Уральске";
const FALLBACK_DESC =
	"KONNEKTEAM — IT-компания в Уральске с 2010 года. Интернет для бизнеса, видеонаблюдение, информационная безопасность, ВОЛС, СКС, IPVPN.";

// ── Список всех маршрутов ────────────────────────────────────────────────────
const routes: string[] = [
	"/",
	"/services",
	"/about",
	"/blog",
	"/contacts",
	"/vacancy",
	"/speedtest",
	...SERVICES.map((s) => `/services/${s.slug}`),
	...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
];

// ── Экранирование для атрибутов/текста ───────────────────────────────────────
const esc = (s: string) =>
	s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

// ── Сборка пер-страничного блока <head> ──────────────────────────────────────
function buildHead(meta: HeadMeta | null, url: string): string {
	const canonical = meta?.canonical || SITE + url;
	const title = meta?.title ? meta.title + TITLE_SUFFIX : FALLBACK_TITLE;
	const description = meta?.description || FALLBACK_DESC;

	const lines = [
		`<title>${esc(title)}</title>`,
		`<meta name="description" content="${esc(description)}" />`,
		meta?.keywords ? `<meta name="keywords" content="${esc(meta.keywords)}" />` : "",
		`<link rel="canonical" href="${esc(canonical)}" />`,
		`<meta property="og:title" content="${esc(title)}" />`,
		`<meta property="og:description" content="${esc(description)}" />`,
		`<meta property="og:url" content="${esc(canonical)}" />`,
		`<meta name="twitter:title" content="${esc(title)}" />`,
		`<meta name="twitter:description" content="${esc(description)}" />`,
	].filter(Boolean);

	// JSON-LD страницы (Service / BlogPosting / BreadcrumbList / FAQPage).
	// "<" экранируем в \u003c, чтобы внутри <script> не возникло "</script>".
	if (meta?.jsonLd?.length) {
		for (const obj of meta.jsonLd) {
			const json = JSON.stringify(obj).replace(/</g, "\\u003c");
			lines.push(`<script type="application/ld+json">${json}</script>`);
		}
	}

	return `<!--seo-->\n\t\t${lines.join("\n\t\t")}\n\t\t<!--/seo-->`;
}

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
const ROOT_DIV = '<div id="root"></div>';

// ── Основной проход ──────────────────────────────────────────────────────────
const template = await readFile(join(DIST, "index.html"), "utf8");

if (!SEO_BLOCK.test(template)) {
	throw new Error("В dist/index.html не найден блок <!--seo-->…<!--/seo-->. Обновите index.html.");
}
if (!template.includes(ROOT_DIV)) {
	throw new Error(`В dist/index.html не найден ${ROOT_DIV}.`);
}

let ok = 0;
for (const url of routes) {
	let html = "";
	let meta: HeadMeta | null = null;
	try {
		({ html, meta } = render(url));
	} catch (err) {
		console.error(`✗ Ошибка рендера ${url}:`, err);
		continue;
	}

	const page = template
		.replace(SEO_BLOCK, buildHead(meta, url))
		.replace(ROOT_DIV, `<div id="root">${html}</div>`);

	const outPath =
		url === "/" ? join(DIST, "index.html") : join(DIST, url.slice(1), "index.html");

	await mkdir(dirname(outPath), { recursive: true });
	await writeFile(outPath, page, "utf8");
	ok++;
	console.log(`✓ ${url}  →  ${outPath}`);
}

// ── sitemap.xml ──────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const sitemap =
	`<?xml version="1.0" encoding="UTF-8"?>\n` +
	`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
	routes
		.map(
			(u) =>
				`  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
		)
		.join("\n") +
	`\n</urlset>\n`;

await writeFile(join(DIST, "sitemap.xml"), sitemap, "utf8");

console.log(`\n✓ Готово: ${ok}/${routes.length} страниц + sitemap.xml (${routes.length} URL)`);
