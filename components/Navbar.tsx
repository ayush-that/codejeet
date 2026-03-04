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
  return (
    <div className="border-b sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="text-lg">
          <Link href="/" className="flex items-center">
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
      </div>
    </div>
  );
};

export default Navbar;
