"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/system-design", label: "System Design" },
];

const navLinkClass =
  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="relative z-10">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CodeJeet"
              width={28}
              height={28}
              priority
              className="h-7 w-7"
            />
            <span className="text-lg font-bold tracking-tight text-foreground">codejeet</span>
          </Link>
        </div>

        <div className="flex-1" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <SignedOut>
            <SignInButton mode="modal">
              <Button type="button" variant="outline" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background py-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 ${navLinkClass} border-b border-border last:border-0`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 py-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button type="button" variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
