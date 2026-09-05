import { PRIVACY_H1, PRIVACY_PARAGRAPHS } from "../../lib/agent-resources";
import { LegalPage } from "../components/legal-page";

export default function Privacy() {
  return <LegalPage crumb="Privacy" paragraphs={PRIVACY_PARAGRAPHS} title={PRIVACY_H1} />;
}
