import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";

import HomePage from "./pages/home";
import ServicesPage from "./pages/services";
import ServiceDetailPage from "./pages/service-detail";
import AboutPage from "./pages/about";
import BlogPage from "./pages/blog";
import ContactPage from "./pages/contact";
import NotFoundPage from "./pages/not-found";
import VacancyPage from "./pages/vacancy";
import SpeedtestPage from "./pages/speedtest";

// Виджет обратной связи Runable нужен ТОЛЬКО в режиме разработки.
// Через ленивый импорт он не попадает ни в продакшен-бандл, ни в SSR-сборку —
// поэтому пререндер не тянет @runablehq/website-runtime и не падает на нём.
// (Заодно полностью убран <RunableBadge /> — бейдж «Made with Runable».)
const AgentFeedback = import.meta.env.DEV
  ? lazy(() =>
      import("@runablehq/website-runtime").then((m) => ({ default: m.AgentFeedback })),
    )
  : null;

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/services/:slug" component={ServiceDetailPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPage} />
        <Route path="/contacts" component={ContactPage} />
        <Route path="/vacancy" component={VacancyPage} />
        <Route path="/speedtest" component={SpeedtestPage} />
        <Route component={NotFoundPage} />
      </Switch>
      {AgentFeedback && (
        <Suspense fallback={null}>
          <AgentFeedback />
        </Suspense>
      )}
    </Provider>
  );
}

export default App;
