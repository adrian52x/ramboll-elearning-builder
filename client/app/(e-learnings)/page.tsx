import { DisplayELearningsPage } from "@/templates/display-elearnings-page";
import { fetchELearnings } from "@/lib/api/elearnings"; 
//import { Suspense } from "react";

export default async function ELearnings() {
    const eLearnings = await fetchELearnings();
    return <DisplayELearningsPage eLearnings={eLearnings} />;
}

/* Using Suspense for data fetching (experimental) */
// export default async function ELearnings() {
//     const eLearningsPromise = fetchELearnings();

//     return (
//         <>
//             <Suspense fallback={<div>Loading e-learnings...</div>}>
//                 <DisplayELearningsPage eLearningsPromise={eLearningsPromise} />   
//             </Suspense>
//         </>  
//     )
// }

