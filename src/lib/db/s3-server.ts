import AWS from "aws-sdk";
import fs from "fs";
import path from "path";    


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

export async function deleteFromS3(fileKey:string){
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

        await s3.deleteObject(params).promise();
        console.log("File deleted successfully");

    }catch(error){
        console.error(error);
    }

}