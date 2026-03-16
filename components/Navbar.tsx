"use client";

import { useState } from "react";
import Link from "next/link";
import { Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const LOGO_LETTERS = [
  { char: "c", color: "#4285F4" },
  { char: "o", color: "#EA4335" },
  { char: "d", color: "#FBBC05" },
  { char: "e", color: "#34A853" },
  { char: "j", color: "#FF6D00" },
  { char: "e", color: "#00BCD4" },
  { char: "e", color: "#A259FF" },
  { char: "t", color: "#FF4081" },
];

const NAV_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/system-design", label: "System Design" },
  { href: "/podcast", label: "Podcast" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="text-lg relative z-10">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
            <span className={pixel.className}>
              {LOGO_LETTERS.map((l, i) => (
                <span key={i} style={{ color: l.color }}>
                  {l.char}
                </span>
              ))}
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
              className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Navbar;
