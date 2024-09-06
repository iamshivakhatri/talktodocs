"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/s3";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

type FileDetails = {
  file_key: string;
  file_name: string;
};

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  loading,
}) => {
  const [isMounted, setIsmounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name }: FileDetails) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/flac": [".flac"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          toast.error("Failed to upload file");
          return;
        }
        mutate(data, {
          onSuccess: ({ chatId }) => {
            toast.success("Chat has been created");
            router.push(`/chat/${chatId}`);
            onClose(); // Close the modal on success
          },
          onError: (error) => {
            console.error(error);
            toast.error("Failed to upload file");
          },
        });
      } catch (error) {
        toast.error("Failed to upload file");
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  useEffect(() => {
    setIsmounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title="Upload File"
      description="Drag & drop your file here to upload it."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6">
        <div
          {...getRootProps({
            className:
              "border-dashed border-2 border-gray-400 p-12 rounded-lg cursor-pointer bg-gray-50 py-8 flex items-center justify-center flex-col",
          })}
        >
          <input {...getInputProps()} disabled={loading || uploading} />
          {isPending || uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
              <p className="text-zinc-400 text-sm mt-2">
                Uploading the file...
              </p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10 text-gray-900" />
              <p className="text-lg font-bold text-stone-500">
                Drag & Drop your files here
              </p>
            </>
          )}
        </div>
      </div>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading || uploading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={loading || uploading}
          variant={"destructive"}
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};
