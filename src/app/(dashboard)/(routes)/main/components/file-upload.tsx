// import FileUpload from "@/components/file-upload";
"use client";

import { UploadModal } from "@/components/modals/upload-modal";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";

import {DrizzleChat} from "@/lib/db/schema";



interface FileUploadProps {
    chats: DrizzleChat[]; // If it's an array of DrizzleChat objects
  }
  


const FileUpload = ({chats}: FileUploadProps) => {
  const [openupload, setOpenUpload] = useState(false);
  const [loadingupload, setLoadingUpload] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (chats.length === 0 || !chats) {
        setOpenUpload(true);
      } else {
        const currentChat = chats[chats.length - 1];
        const chatId = currentChat.id.toString();
        router.push(`/chat/${chatId}`);
        setOpenUpload(false);
      }
  }, []);

  useEffect(() => {
    router.refresh();
  }, [loadingupload]);



  const handleCloseUpload = () => {
    toast.error("Upload pdf, or youtube url to continue");
  };

  return (
      <div>
        <UploadModal
          isOpen={openupload}
          onClose={handleCloseUpload}
          loading={loadingupload}
          setLoading={setLoadingUpload}
        />
      </div>
  );
};

export default FileUpload;
