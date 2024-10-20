import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import { AssemblyAI } from 'assemblyai';

// Generate unique filename
function generateUniqueFilename(originalFilename: string, extension: string = '.mp3'): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomString}${extension}`;
}

// Send file to AssemblyAI for transcription
async function sendAssemblyAI(publicUrl: string) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error('AssemblyAI API key is required');
  }
  const client = new AssemblyAI({
    apiKey: apiKey,
  });
  
  const data = {
    audio: publicUrl,
  };

  const transcript = await client.transcripts.transcribe(data);
  console.log(transcript.text);
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('audio') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No audio file found' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const originalFilename = file.name;
  const tempFilename = generateUniqueFilename(originalFilename, path.extname(originalFilename));
  const mp3Filename = generateUniqueFilename(originalFilename, '.mp3');
  const tempFilepath = path.join(process.cwd(), 'public', 'uploads', tempFilename);
  const mp3Filepath = path.join(process.cwd(), 'public', 'uploads', mp3Filename);

  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8ArrayBuffer = new Uint8Array(buffer);

    // Save the original file
    await writeFile(tempFilepath, uint8ArrayBuffer); // Use Uint8Array instead of Buffer

    // Convert to MP3 using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilepath)
        .toFormat('mp3')
        .on('error', (err) => {
          console.error('An error occurred: ' + err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('Processing finished!');
          resolve(null);
        })
        .save(mp3Filepath);
    });

    // Delete the temporary file
    await unlink(tempFilepath);

    const publicUrl = `/uploads/${mp3Filename}`; // Relative path

    // Send the file to AssemblyAI for transcription
    await sendAssemblyAI(publicUrl);

    return NextResponse.json({
      message: 'File uploaded and converted to MP3 successfully',
      filepath: publicUrl,
      originalFilename: originalFilename,
      uniqueFilename: mp3Filename,
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Error processing the file' }, { status: 500 });
  }
}

export const runtime = 'nodejs'; // Use node.js runtime (or 'edge' if needed)
export const dynamic = 'force-dynamic'; // Force dynamic rendering for the API
export const revalidate = false; // Disable revalidation for this route