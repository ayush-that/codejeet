import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "../app/globals.css";
import { SiteShell } from "./components/site-shell";

export default function App() {
  return (
    <Suspense>
      <Router root={SiteShell}>{FileRoutes()}</Router>
    </Suspense>
  );
}
