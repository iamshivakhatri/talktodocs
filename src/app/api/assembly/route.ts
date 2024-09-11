import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

function generateUniqueFilename(originalFilename: string, extension: string = '.mp3'): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomString}${extension}`;
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
    // Save the original file
    await writeFile(tempFilepath, Buffer.from(buffer));

    // Convert to MP3
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilepath)
        .toFormat('mp3')
        .on('error', (err) => {
          console.error('An error occurred: ' + err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('Processing finished !');
          resolve(null);
        })
        .save(mp3Filepath);
    });

    // Delete the temporary file
    await unlink(tempFilepath);

    const publicUrl = `/uploads/${mp3Filename}`;

    return NextResponse.json({ 
      message: 'File uploaded and converted to MP3 successfully',
      filepath: publicUrl,
      originalFilename: originalFilename,
      uniqueFilename: mp3Filename
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Error processing the file' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};