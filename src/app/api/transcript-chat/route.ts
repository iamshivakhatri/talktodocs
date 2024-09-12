// app/api/upload-transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import jsPDF from 'jspdf';

// Configure AWS SDK
AWS.config.update({
    accessKeyId:process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
    secretAccessKey:process.env.NEXT_PUBLIC_S3_SECRET_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();

async function uploadTranscriptToS3(transcript: string) {
  const uniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const file_key = `uploads/${uniqueId}_transcript.pdf`;
  const file_name = `${uniqueId}_transcript.pdf`;


  console.log('thisis file key', file_key);
    console.log('thisis file name', file_name);
  // Create PDF
  const doc = new jsPDF();
  
  // Split the transcript into lines that fit within the page width
  const lines = doc.splitTextToSize(transcript, 180);
  
  // Add the lines to the PDF
  doc.text(lines, 10, 10);

  // Get the PDF as a buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

  // Upload to S3
  const params = {
    Bucket:'sk-chat-app-storage',
    Key: file_key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  };

  await s3.upload(params).promise();
  console.log("Successfully uploaded transcript to S3", file_key);

const upload = s3.putObject(params).on('httpUploadProgress', function(evt) {
    console.log("Uploading to S3... " + parseInt(((evt.loaded * 100) / evt.total).toString()) + '%');
}).promise();

await upload.then((data)=>{
    console.log("Successfully uploaded to S3", file_key);
})

  return { file_key, file_name };
}

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ message: 'Transcript is required' }, { status: 400 });
    }

    const uploadResult = await uploadTranscriptToS3(transcript);
    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error) {
    console.error("Error in transcript upload API:", error);
    return NextResponse.json({ message: 'Error uploading transcript' }, { status: 500 });
  }
}