// app/api/transcript/route.js
import * as ytTranscript from 'youtube-transcript-api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { youtubeUrl } = body;

    // Extract the video ID from the YouTube URL
    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), { status: 400 });
    }

    // Fetch the transcript using the youtube-transcript-api package
    const transcript = await ytTranscript.fetchTranscript(videoId);

    // Return the transcript in the response
    return new Response(JSON.stringify({ transcript }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch transcript' }), { status: 500 });
  }
}

// Helper function to extract video ID from a YouTube URL
function extractVideoId(url: string){
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}
