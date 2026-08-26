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
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-muted-foreground shrink-0">
            Built with <BsSuitHeartFill className="ml-1 mr-1" />
            by shydev
          </span>
          <span className="hidden md:block text-sm text-muted-foreground text-center">
            Questions sourced from{" "}
            <a
              href="https://github.com/liquidslr/interview-company-wise-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              liquidslr/interview-company-wise-problems
            </a>
          </span>
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
        <nav
          aria-label="About and legal"
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
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
      </div>
    </footer>
  );
};

export default Footer;
