import AWS from 'aws-sdk';
import PDFDocument from 'pdfkit';
import crypto from 'crypto';

export async function uploadToS3(file:File){
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

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace('', '_');

        console.log("Uploading to S3... file_key", file_key);
        console.log("Uploading to S3... file_name", file.name);

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
            
        };

        const upload = s3.putObject(params).on('httpUploadProgress', function(evt) {
            console.log("Uploading to S3... " + parseInt(((evt.loaded * 100) / evt.total).toString()) + '%');
        }).promise();

        await upload.then((data)=>{
            console.log("Successfully uploaded to S3", file_key);
        })

        return Promise.resolve({
            file_key: file_key,
            file_name: file.name
        })
        

    }catch(error){

    }
}

export function getS3Url(file_key:string){
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
}

// export async function uploadTranscriptToS3(transcript: string) {
//     try {
//         console.log("Uploading transcript to S3...");
//         console.log("Transcript:", transcript);

//         // Configure AWS credentials
//         AWS.config.update({
//             accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
//             secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
//         });

//         // Create S3 instance
//         const s3 = new AWS.S3({
//             region: 'us-east-2',
//         });

//         // Generate a unique identifier
//         const uniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

//         // Create a unique key and filename for the file in S3
//         const file_key = `transcripts/${uniqueId}_transcript.pdf`;
//         const file_name = `${uniqueId}_transcript.pdf`;

//         // Create a PDF document
//         const doc = new PDFDocument();
//         let buffers: Buffer[] = [];
//         doc.on('data', buffers.push.bind(buffers));
//         doc.text(transcript);
//         doc.end();

//         // Combine PDF buffers
//         const pdfBuffer = Buffer.concat(buffers);

//         // Define the S3 upload parameters
//         const params = {
//             Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
//             Key: file_key,
//             Body: pdfBuffer,
//             ContentType: 'application/pdf',
//         };

//         // Upload the PDF to S3
//         const upload = s3.putObject(params).on('httpUploadProgress', function (evt) {
//             console.log("Uploading to S3... " + parseInt(((evt.loaded * 100) / evt.total).toString()) + '%');
//         }).promise();

//         // Await the upload completion and return file info
//         await upload.then(() => {
//             console.log("Successfully uploaded transcript to S3", file_key);
//         });

//         // Return file details on successful upload
//         return Promise.resolve({
//             file_key: file_key,
//             file_name: file_name,
//         });

//     } catch (error) {
//         console.error("Error uploading transcript to S3", error);
//         return Promise.reject("Failed to upload transcript to S3");
//     }
// }