import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import "../app/globals.css";
import { SiteShell } from "./components/site-shell";
import About from "./routes/about";
import Blog from "./routes/blog";
import BlogPost from "./routes/blog-post";
import Companies from "./routes/companies";
import Company from "./routes/company";
import Dashboard from "./routes/dashboard";
import Contact from "./routes/contact";
import Developers from "./routes/developers";
import Difficulty from "./routes/difficulty";
import Home from "./routes/index";
import Privacy from "./routes/privacy";
import SystemDesign from "./routes/system-design";
import SystemDesignChapter from "./routes/system-design-chapter";
import Topic from "./routes/topic";

export default function App() {
  return (
    <Suspense>
      <Router root={SiteShell}>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/companies" component={Companies} />
        <Route path="/company/:slug" component={Company} />
        <Route path="/about" component={About} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/developers" component={Developers} />
        <Route path="/difficulty/:level" component={Difficulty} />
        <Route path="/system-design" component={SystemDesign} />
        <Route path="/system-design/:slug" component={SystemDesignChapter} />
        <Route path="/topic/:slug" component={Topic} />
      </Router>
    </Suspense>
  );
}
