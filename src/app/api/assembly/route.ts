// pages/api/upload-audio.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

const saveFile = async (file: File) => {
  const dir = 'tmp';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, `audio-${Date.now()}.mp3`);
  const data = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(data));
  return filePath;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the file:', err);
      return res.status(500).json({ error: 'Failed to parse the file.' });
    }

    const file = files.audioFile as unknown as File;
    const filePath = await saveFile(file);
    console.log(`File saved successfully at ${filePath}`);

    // Upload the file to AssemblyAI
    const fileStream = fs.createReadStream(filePath);

    try {
      const response = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        fileStream,
        {
          headers: {
            'authorization': process.env.ASSEMBLYAI_API_KEY,
            'content-type': 'audio/mp3',
          },
        }
      );

      // Remove the file after upload
      fs.unlinkSync(filePath);

      // Return the response from AssemblyAI
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error uploading to AssemblyAI:', error);
      return res.status(500).json({ error: 'Failed to upload to AssemblyAI.' });
    }
  });
};

export default handler;
