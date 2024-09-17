// import FileUpload from "@/components/file-upload";

import {embedding} from "@/constant";
import { getMatchesFromEmbeddings } from "@/lib/context";


const DashboardPage =async () => {
    const file_key = 'uploads/1726534996575_Khatri, Shiva_CEP 300_FA24_CPT Letter.pdf';
    // const file_key = 'uploads/1726526852235_Khatri, Shiva_CEP 300_FA24_CPT Letter.pdf';
    const matches = await getMatchesFromEmbeddings(embedding, file_key); 
    console.log("Matches from embeddings in the main", matches);
     // Async function to handle form submission


    return ( <div>
        <div className="m-auto lg:max-w-2xl">
         {/* <FileUpload /> */}

        </div>
        
    </div> );
}
 
export default DashboardPage;