import Link from "next/link";
import { BsTwitterX, BsSuitHeartFill, BsGithub } from "react-icons/bs";

const FOOTER_LINKS = [
  { href: "/companies", label: "Companies" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/blog", label: "Blog" },
  { href: "/system-design", label: "System Design" },
  { href: "/podcast", label: "Podcast" },
];

const Footer = () => {
  return (
    <footer className="py-4 border-t">
      <div className="container mx-auto px-4 space-y-3 md:space-y-0">
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-6 gap-y-1 md:hidden"
        >
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm shrink-0">
            Built with <BsSuitHeartFill className="ml-1 mr-1" />
            by shydev
          </span>
          <nav
            aria-label="Footer navigation"
            className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-1"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4 shrink-0">
            <a href="https://twitter.com/shydev69" target="_blank" rel="noopener noreferrer">
              <BsTwitterX size={24} />
            </a>
            <a
              href="https://github.com/ayush-that/codejeet"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsGithub size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
