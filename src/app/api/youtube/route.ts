import { NextResponse, NextRequest } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { detect } from 'langdetect';
import { toast } from 'react-hot-toast';

export const runtime = 'edge';

export async function GET(request:NextRequest) {
  const { searchParams } = new URL(request.url);
  const youtubeUrl = searchParams.get('url');
  console.log("This is the youtubeUrl", youtubeUrl);

  if (!youtubeUrl) {
    return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl, {
        lang: 'en',
      });
    console.log("This is the transcript recieved in the api", transcript);

    if (transcript.length === 0) {
      return NextResponse.json({ error: 'No transcript available' }, { status: 404 });
    }

    const fullText = transcript.map(entry => entry.text).join(' ');
//     const detectedLanguage = detect(fullText);

//     if (detectedLanguage[0].lang !== 'en') {
//       return NextResponse.json({ error: 'Content is not in English' }, { status: 422 });
//     }

    return NextResponse.json({ transcript: fullText }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transcript:', error);

    toast.error('Failed to fetch transcript');

    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 });
  }
}