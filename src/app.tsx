import { Route, Router } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";
import "../app/globals.css";
import { SiteShell } from "./components/site-shell";
import About from "./routes/about";
import Blog from "./routes/blog";
import BlogPost from "./routes/blog-post";
import Companies from "./routes/companies";
import Compare from "./routes/compare";
import ComparePair from "./routes/compare-pair";
import Company from "./routes/company";
import CompanyFilter from "./routes/company-filter";
import Dashboard from "./routes/dashboard";
import Contact from "./routes/contact";
import Developers from "./routes/developers";
import Difficulty from "./routes/difficulty";
import Home from "./routes/index";
import Learn from "./routes/learn";
import LearnCourse from "./routes/learn-course";
import LearnLesson from "./routes/learn-lesson";
import LearnQuiz from "./routes/learn-quiz";
import Privacy from "./routes/privacy";
import Podcast from "./routes/podcast";
import SystemDesign from "./routes/system-design";
import SystemDesignChapter from "./routes/system-design-chapter";
import Topic from "./routes/topic";

export default function App() {
  return (
    <Suspense>
      <ErrorBoundary
        fallback={
          <main class="container mx-auto px-4 py-8">
            <p>Could not load this page.</p>
            <a class="mt-3 inline-block underline" href="/">Return home</a>
          </main>
        }
      >
      <Router root={SiteShell}>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/companies" component={Companies} />
        <Route path="/compare" component={Compare} />
        <Route path="/compare/:pair" component={ComparePair} />
        <Route path="/company/:slug" component={Company} />
        <Route path="/company/:slug/:filter" component={CompanyFilter} />
        <Route path="/about" component={About} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/podcast" component={Podcast} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:course" component={LearnCourse} />
        <Route path="/learn/:course/:lesson" component={LearnLesson} />
        <Route path="/learn/:course/quiz/:quiz" component={LearnQuiz} />
        <Route path="/developers" component={Developers} />
        <Route path="/difficulty/:level" component={Difficulty} />
        <Route path="/system-design" component={SystemDesign} />
        <Route path="/system-design/:slug" component={SystemDesignChapter} />
        <Route path="/topic/:slug" component={Topic} />
      </Router>
      </ErrorBoundary>
    </Suspense>
  );
}
