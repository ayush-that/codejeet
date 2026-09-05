import { For, Show, createSignal, type ParentProps } from "solid-js";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/system-design", label: "System Design" },
];

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/developers", label: "Developers" },
];

export function SiteShell(props: ParentProps) {
  const [mobileOpen, setMobileOpen] = createSignal(false);
  const closeMenu = () => setMobileOpen(false);

  return (
    <div class="flex min-h-screen flex-col bg-background">
      <header class="sticky top-0 z-50 border-b border-border bg-background">
        <div class="container mx-auto flex h-16 items-center px-4">
          <a
            class="brand-lockup font-heading"
            href="/"
            onClick={closeMenu}
            aria-label="Codejeet home"
          >
            <span class="brand-wordmark select-none">CODEJEET</span>
          </a>
          <div class="flex-1" />
          <nav class="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            <For each={navLinks}>
              {(link) => (
                <a
                  class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </a>
              )}
            </For>
          </nav>
          <button
            aria-expanded={mobileOpen()}
            aria-label={mobileOpen() ? "Close menu" : "Open menu"}
            class="ml-3 p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true">{mobileOpen() ? "×" : "☰"}</span>
          </button>
        </div>
        <Show when={mobileOpen()}>
          <nav
            class="border-t border-border bg-background py-1 md:hidden"
            aria-label="Mobile navigation"
          >
            <For each={navLinks}>
              {(link) => (
                <a
                  class="block border-b border-border px-4 py-3 text-sm text-muted-foreground last:border-0 hover:text-foreground"
                  href={link.href}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              )}
            </For>
          </nav>
        </Show>
      </header>
      <div class="flex-1 overflow-x-clip">{props.children}</div>
      <footer class="border-t border-border py-4">
        <div class="container mx-auto flex flex-col items-center gap-3 px-4 text-sm text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4">
          <span class="sm:justify-self-start">Built with ♥ by shydev</span>
          <nav class="flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="About and legal">
            <For each={footerLinks}>
              {(link) => (
                <a
                  class="underline-offset-2 transition-colors hover:text-foreground hover:underline"
                  href={link.href}
                >
                  {link.label}
                </a>
              )}
            </For>
          </nav>
          <div class="flex items-center gap-4 sm:justify-self-end">
            <a
              aria-label="Codejeet on X"
              href="https://twitter.com/shydev69"
              rel="noopener noreferrer"
              target="_blank"
            >
              𝕏
            </a>
            <a
              aria-label="Codejeet on GitHub"
              href="https://github.com/ayush-that/codejeet"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
