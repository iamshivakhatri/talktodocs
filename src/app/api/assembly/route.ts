import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalFilename);
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
  const uniqueFilename = generateUniqueFilename(originalFilename);
  const filepath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);

  try {
    await writeFile(filepath, Buffer.from(buffer));
    
    // Here you would typically process the audio file
    // For example, convert it to MP3, transcribe it, etc.
    // For now, we'll just return a success message with the file path

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filepath: publicUrl,
      originalFilename: originalFilename,
      uniqueFilename: uniqueFilename
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving the file' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};