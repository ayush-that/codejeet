import { BsTwitterX, BsSuitHeartFill, BsGithub } from "react-icons/bs";

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
      </div>
    </footer>
  );
};

export default Footer;
