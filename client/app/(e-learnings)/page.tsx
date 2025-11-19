import { DisplayELearningsPage } from "@/templates/display-elearnings-page";
import { fetchELearnings } from "@/lib/api/elearnings";

export default async function ELearnings() {
    const eLearnings = await fetchELearnings();
    return <DisplayELearningsPage eLearnings={eLearnings} />;
}
