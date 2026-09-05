import { DEVELOPERS_H1, DEVELOPERS_PARAGRAPHS } from "../../lib/agent-resources";
import { LegalPage } from "../components/legal-page";

export default function Developers() {
  return <LegalPage crumb="Developers" paragraphs={DEVELOPERS_PARAGRAPHS} title={DEVELOPERS_H1} />;
}
