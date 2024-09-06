import AWS from "aws-sdk";
import fs from "fs";
import path from "path";   

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";


export async function downloadFromS3(fileKey: string) {
    try{
        AWS.config.update({
            accessKeyId:process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey:process.env.NEXT_PUBLIC_S3_SECRET_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'us-east-2',
            }
        );

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: fileKey,
        }

        const obj = await s3.getObject(params).promise();
        console.log("Object from S3", obj);
        const dir = 'tmp';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        const fileName = path.join(dir, `pdf-${Date.now()}.pdf`);
        fs.writeFileSync(fileName, obj.Body as Buffer);

        console.log(`File saved successfully at ${fileName}`);
        return fileName;

    }catch(error){
        console.error(error);
    }
    
}

// export async function deleteFromS3(fileKey:string){
//     try{
//         console.log("fileKey in the deletefrom s3", fileKey);
//         AWS.config.update({
//             accessKeyId:process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
//             secretAccessKey:process.env.NEXT_PUBLIC_S3_SECRET_KEY,
//         });
//         const s3 = new AWS.S3({
//             params: {
//                 Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
//             },
//             region: 'us-east-2',
//             }
//         );

//         const params = {
//             Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//             Key: fileKey,
//         }

//         const response = await s3.deleteObject(params).promise();
//         console.log("Response from S3 while deleting ", response);
//         console.log("File deleted successfully");

//     }catch(error){
//         console.error(error);
//     }

// }

export const deleteFromS3 = async (fileKey: string) => {
    // Initialize the S3 client with configuration
    const client = new S3Client({
      region: process.env.NEXT_PUBLIC_S3_REGION, // e.g., 'us-east-2'
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY!,
      },
    });
    console.log("filekey in deletefroms3", fileKey);
  
    // Define the parameters for the delete operation
    const params = {
      Bucket: "sk-chat-app-storage", // Your bucket name
      Key: fileKey, // The key of the file to delete
    };
  
    try {
      // Create a new DeleteObjectCommand with the parameters
      const command = new DeleteObjectCommand(params);
  
      // Send the command to S3
      const response = await client.send(command);
  
      // Log the response
      console.log("Delete response:", response);
  
    } catch (error) {
      // Handle errors
      console.error("Error deleting object from S3:", error);
    }
  };