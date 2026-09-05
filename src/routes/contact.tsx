import { CONTACT_H1, CONTACT_PARAGRAPHS } from "../../lib/agent-resources";
import { LegalPage } from "../components/legal-page";

export default function Contact() {
  return <LegalPage crumb="Contact" paragraphs={CONTACT_PARAGRAPHS} title={CONTACT_H1} />;
}
