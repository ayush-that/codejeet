import type { Metadata } from "next";
import Link from "next/link";
import { NOT_FOUND_MARKDOWN } from "@/lib/agent-resources";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="text-center text-6xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-center text-xl">
        Sorry, the page you are looking for does not exist.
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">
          CodeJeet home
        </Link>
        {" · "}
        <Link href="/llms.txt" className="underline underline-offset-2 hover:text-foreground">
          llms.txt
        </Link>
        {" · "}
        <Link href="/sitemap.xml" className="underline underline-offset-2 hover:text-foreground">
          sitemap
        </Link>
      </p>
      <pre className="mt-10 w-full max-w-2xl overflow-x-auto whitespace-pre-wrap rounded-lg border bg-card p-4 text-left text-sm leading-relaxed text-muted-foreground">
        {NOT_FOUND_MARKDOWN}
      </pre>
    </div>
  );
}
