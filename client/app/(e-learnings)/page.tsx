import eLearningsData from "@/data/e-learnings.json";
import { ELearningsPage } from "@/templates/e-learnings-page";

export default function ELearnings() {
    return <ELearningsPage eLearnings={eLearningsData} />;
}
