import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";
import App from "./app.tsx";

const queryClient = new QueryClient();

const tree = (
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Router>
				<App />
			</Router>
		</QueryClientProvider>
	</StrictMode>
);

const rootEl = document.getElementById("root")!;

// В продакшене #root уже содержит пререндеренную разметку → гидрируем её.
// В dev (vite) разметки нет → обычный клиентский рендер. Так dev не ломается.
if (rootEl.hasChildNodes()) {
	hydrateRoot(rootEl, tree);
} else {
	createRoot(rootEl).render(tree);
}
