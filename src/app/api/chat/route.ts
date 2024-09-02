import { Configuration, OpenAIApi } from 'openai-edge';
// import { CoreMessage, streamText } from 'ai';
import { CoreMessage,convertToCoreMessages, streamText } from 'ai';
import dotenv from 'dotenv';
import { openai } from '@ai-sdk/openai';
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const maxDuration = 30; // 

// dotenv.config();


// export const runtime = "edge";


// const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
        // Parse the request body to get the messages array
        const { messages, chatId } = await req.json();
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        const lastMessage = messages[messages.length - 1];
        console.log("lastMessage", lastMessage);
        if(_chats.length != 1){
            return NextResponse.json({error: 'chat not found'}, {status: 404});
        }
        const fileKey = _chats[0].fileKey;
        const context = await getContext(lastMessage.content, fileKey);

 
        console.log("messages", messages);

        // Ensure messages are passed correctly
        if (!messages || !Array.isArray(messages)) {
            throw new Error("Invalid prompt format: 'messages' must be an array of message objects.");
        }

        // Use streamText to get a streaming response from OpenAI
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: `You are a helpful, respectful, and honest assistant.`,
            messages: convertToCoreMessages(messages),
        });

        // Stream the text response back to the client
        return result.toDataStreamResponse();


    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
