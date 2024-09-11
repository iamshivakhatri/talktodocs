import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,  // Disable default body parser
    },
};

export async function POST(req: Request) {
    if (!req.body) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try {
        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create a writable stream to save the uploaded file
        const filePath = path.join(uploadDir, `upload-${Date.now()}.webm`);
        const fileStream = fs.createWriteStream(filePath);

        // Read the incoming request body as a stream and pipe it to the file
        await new Promise((resolve, reject) => {
            const reader = req.body?.getReader();
            if (!reader) {
                reject(new Error('Failed to get the request body reader'));
                return;
            }
            const writer = fileStream;

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    writer.end();
                    resolve(undefined);
                    return;
                }
                writer.write(value);
                reader.read().then(processText).catch(reject);
            }).catch(reject);
        });

        // Respond with the file URL
        return NextResponse.json({ fileUrl: `/uploads/upload-${Date.now()}.webm` });
    } catch (error) {
        console.error('Error saving the file:', error);
        return NextResponse.json({ error: 'Error saving the file' }, { status: 500 });
    }
}
