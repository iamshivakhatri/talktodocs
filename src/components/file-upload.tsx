"use client";

import { uploadToS3 } from '@/lib/s3';
import { Inbox } from 'lucide-react';
import React from 'react'
import {useDropzone} from 'react-dropzone';



const FileUpload = () => {
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
                alert('File size exceeds 10MB');
                return;
            }

            try{
                const data = await uploadToS3(file);
            }catch(error){
                alert('Failed to upload file');
                console.log(error);
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
            <>
             <Inbox className='w-10 h-10 text-gray-900'/>
             <p className='text-lg font-bold text-stone-500'>Drag & Drop your files here</p>
            </>
        </div>
    </div>
  )
}

export default FileUpload