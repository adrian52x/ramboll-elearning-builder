import eLearningsData from "@/data/e-learnings.json";
import { DisplayELearningsPage } from "@/templates/display-elearnings-page";

export default function ELearnings() {
    return <DisplayELearningsPage eLearnings={eLearningsData} />;
}
