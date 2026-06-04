import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app";
import { SSRHeadContext, type HeadHolder } from "./lib/seo";

// Рендерит приложение для одного URL в строку HTML и возвращает собранные
// SEO-метаданные этой страницы. Вызывается из prerender.ts на этапе сборки.
// ВАЖНО: без <StrictMode> — нужен ровно один проход рендера.
export function render(url: string): { html: string; meta: HeadHolder["meta"] } {
	const holder: HeadHolder = { meta: null };
	const queryClient = new QueryClient();

	const html = renderToString(
		<SSRHeadContext.Provider value={holder}>
			<QueryClientProvider client={queryClient}>
				<Router ssrPath={url}>
					<App />
				</Router>
			</QueryClientProvider>
		</SSRHeadContext.Provider>,
	);

	return { html, meta: holder.meta };
}
