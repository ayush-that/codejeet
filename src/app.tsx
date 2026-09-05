import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "../app/globals.css";
import { SiteShell } from "./components/site-shell";
import About from "./routes/about";
import Companies from "./routes/companies";
import Dashboard from "./routes/dashboard";
import Contact from "./routes/contact";
import Developers from "./routes/developers";
import Home from "./routes/index";
import Privacy from "./routes/privacy";

export default function App() {
  return (
    <Suspense>
      <Router root={SiteShell}>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/companies" component={Companies} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/developers" component={Developers} />
      </Router>
    </Suspense>
  );
}
