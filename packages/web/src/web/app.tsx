import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

import HomePage from "./pages/home";
import ServicesPage from "./pages/services";
import ServiceDetailPage from "./pages/service-detail";
import AboutPage from "./pages/about";
import BlogPage from "./pages/blog";
import ContactPage from "./pages/contact";
import NotFoundPage from "./pages/not-found";
import VacancyPage from "./pages/vacancy";

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
        <Route component={NotFoundPage} />
      </Switch>
      {import.meta.env.DEV && <AgentFeedback />}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
