

// import FileUpload from "@/components/file-upload";
"use client";

import {embedding} from "@/constant";
import { getMatchesFromEmbeddings } from "@/lib/context";
import {UploadModal} from "@/components/modals/upload-modal";
import {useState} from "react";
import { toast } from "react-hot-toast";




const DashboardPage = () => {
    const [openupload, setOpenUpload] = useState(true);
    const [loadingupload, setLoadingUpload] = useState(false);

    const handleCloseUpload = () => {
        toast.error("Upload pdf, or youtube url to continue");
    }





    return ( 
        <>
         <UploadModal
        isOpen={openupload}
        onClose={handleCloseUpload}
        loading={loadingupload}
      />
         <div>
        <div className="m-auto lg:max-w-2xl">
          
        </div>
        
        </div>
        </>
    );
}
 
export default DashboardPage;