import { BsTwitterX, BsSuitHeartFill, BsGithub } from "react-icons/bs";
import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/developers", label: "Developers" },
];

const Footer = () => {
  return (
    <footer className="py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-4">
          <span className="flex items-center text-sm text-muted-foreground sm:justify-self-start">
            Built with <BsSuitHeartFill className="ml-1 mr-1" />
            by shydev
          </span>
          <nav
            aria-label="About and legal"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm text-muted-foreground"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline-offset-2 hover:text-foreground hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4 sm:justify-self-end">
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
