import { createContext } from "react";

// Метаданные одной страницы — ровно то, что страница передаёт в <SEO>.
export interface HeadMeta {
	title: string;
	description: string;
	keywords?: string;
	canonical?: string;
	ogImage?: string;
	// Структурированные данные Schema.org (JSON-LD), уже нормализованные в массив.
	jsonLd?: object[];
}

// Изменяемый «карман», который заполняется во время SSR-рендера и читается
// пререндером после renderToString. На клиенте провайдера нет → остаётся null,
// поэтому на работу сайта в браузере это никак не влияет.
export interface HeadHolder {
	meta: HeadMeta | null;
}

export const SSRHeadContext = createContext<HeadHolder | null>(null);
