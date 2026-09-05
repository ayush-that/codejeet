import { ABOUT_H1, ABOUT_PARAGRAPHS } from "../../lib/agent-resources";
import { LegalPage } from "../components/legal-page";

export default function About() {
  return <LegalPage crumb="About" paragraphs={ABOUT_PARAGRAPHS} title={ABOUT_H1} />;
}
