import { DisplayELearningsPage } from "@/templates/display-elearnings-page";
import { ELearningAPI } from "@/lib/api/elearnings"; 
//import { Suspense } from "react";

export default async function ELearnings() {
    return <DisplayELearningsPage />;
}

/* Using Suspense for data fetching (experimental) */
// export default async function ELearnings() {
//     const eLearningsPromise = ELearningAPI.fetchELearnings();

//     return (
//         <>
//             <Suspense fallback={<div>Loading e-learnings...</div>}>
//                 <DisplayELearningsPage eLearningsPromise={eLearningsPromise} />   
//             </Suspense>
//         </>  
//     )
// }

