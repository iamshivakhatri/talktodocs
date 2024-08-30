"use client";

import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react'
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

type FileDetails = {
    file_key: string;
    file_name: string;
}




const FileUpload = () => {
    const [uploading, setuploading] = useState(false);
    const {mutate,isPending} = useMutation({
        mutationFn: async({ file_key, file_name, }: FileDetails) => {

        const response = await axios.post("/api/create-chat", {
            file_key,
            file_name,
        });
        return response.data;
    }

    });
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
            'audio/flac': ['.flac']
        },
        onDrop: async  acceptedFiles => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if(file.size > 10 * 1024 * 1024){
                // alert('File size exceeds 10MB');
                toast.error('File size exceeds 10MB');
                return;
            }

            try{
                setuploading(true);
                const data = await uploadToS3(file);
                if (!data?.file_key|| !data?.file_name){
                    toast.error('Failed to upload file');

                    return;
                }
                mutate(data, {
                    onSuccess: (data) =>{
                        console.log(data);
                        toast.success('File uploaded successfully', data.message);
                    },
                    onError: (error) =>{
                        console.error(error);
                        toast.error('Failed to upload file');
                    }
                })
        
            }catch(error){
                toast.error('Failed to upload file');
                console.log(error);
            }finally{
                setuploading(false);
            }
            
        }

    });
  return (
    
    <div className='p-2 bg-black roundex-2xl text-white text-center '>
        <div 
        {...getRootProps({
            className: 'border-dashed border-2 border-gray-400 p-12 rounded-lg cursor-pointer bg-gray-50 py-8 flex items-center justify-center flex-col' 
        })}
   
        >
            <input {...getInputProps} disabled/>
            {(isPending || uploading) ?(
                <>
                <Loader2 className='w-10 h-10 text-gray-900 animate-spin'/>
                <p className='text-zinc-400 text-sm mt-2'> Uploading the file...</p>
                </>

            ):(
                <>
                <Inbox className='w-10 h-10 text-gray-900'/>
                <p className='text-lg font-bold text-stone-500'>Drag & Drop your files here</p>
               </>
            )
          
            }

       
            
        </div>
    </div>
  )
}

export default FileUpload