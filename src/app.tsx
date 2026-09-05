import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "../app/globals.css";
import { SiteShell } from "./components/site-shell";
import Dashboard from "./routes/dashboard";
import Home from "./routes/index";

export default function App() {
  return (
    <Suspense>
      <Router root={SiteShell}>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
      </Router>
    </Suspense>
  );
}
