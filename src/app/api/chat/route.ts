import { Configuration, OpenAIApi } from 'openai-edge';
// import { CoreMessage, streamText } from 'ai';


import { CoreMessage,convertToCoreMessages, streamText, Message,  } from 'ai';
import dotenv from 'dotenv';
import { openai } from '@ai-sdk/openai';
import { getContext } from '@/lib/context';
import { db } from '@/lib/db';
import { chats, messages as _messages, messageRecords } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { checkSubscription } from "@/lib/subscription";
import { apiLimit } from "@/lib/api-limit";
import {MAX_FREE_COUNTS} from "@/constant";



export const maxDuration = 30; // 

// dotenv.config();


// export const runtime = "edge";


// const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    const isPro = await  checkSubscription();
    let numberOfMessages = await apiLimit();
    if(!numberOfMessages){
      numberOfMessages = 0;
    }

    

    try {

        const {userId}: {userId: string | null} = auth();
        if (!userId) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401});


        }
        const messageLimit = MAX_FREE_COUNTS || 17                                               // Set a default limit


        if (!isPro && numberOfMessages >= messageLimit) {
            console.log("Exceeded free usage limit");
            return NextResponse.json({error: 'Exceeded free usage limit'}, {status: 402});
        }


        // Parse the request body to get the messages array
        const { messages, chatId } = await req.json();
        console.log("messages in the posst", messages);
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        const lastMessage = messages[messages.length - 1];
        console.log("lastMessage", lastMessage);
        if(_chats.length != 1){
            return NextResponse.json({error: 'chat not found'}, {status: 404});
        }
        const fileKey = _chats[0].fileKey;
        const context = await getContext(lastMessage.content, fileKey);

        const systemPrompt = `AI assistant is a powerful, human-like AI with expert knowledge. 
        It's helpful, clever, articulate, well-behaved, friendly, and inspiring. 
        It has vast knowledge and can answer nearly any question accurately. 
        AI assistant is a fan of Pinecone and Vercel.
        ${context ? `CONTEXT: ${context}` : ''}
        If the context doesn't provide an answer, say "I'm sorry, but I don't know the answer to that question".
        Don't apologize for previous responses, but indicate if new information was gained.
        Don't invent anything not directly from the context.`;


 
        console.log("messages", messages);

        // Ensure messages are passed correctly
        if (!messages || !Array.isArray(messages)) {
            throw new Error("Invalid prompt format: 'messages' must be an array of message objects.");
        }

                // Filter the messages to get only the user's messages
        const userMessages = messages.filter((message: Message) => message.role === "user");

        // Get the last 3 messages from the user's messages
        const lastThreeMessages = userMessages.slice(-3);  // Slicing to get the last 3 items
        console.log("lastThreeMessages", lastThreeMessages);


        // Save user message into the database
    
        await db.insert(_messages).values({
            chatId,
            content: lastMessage.content,
            role: "user",
        });

        





        // Use streamText to get a streaming response from OpenAI
        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: systemPrompt,
            messages: lastThreeMessages, // Pass only the last three user messages
            // messages: [
            //     prompt,
            //     ...messages.filter((message: Message) => message.role === "user"),
            //   ],
            async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
            // implement your own storage logic:
            await db.insert(_messages).values({
                chatId,
                content: text,
                role: "system",
            });

            const existingRecord = await db.select().from(messageRecords).where(eq(messageRecords.userId, userId))
            console.log("existingRecord", existingRecord);

            if (existingRecord.length > 0) {
                // If record exists, update the record
                await db.update(messageRecords)
                    .set({
                        numberOfMessages: sql`${messageRecords.numberOfMessages} + 1`,
                    })
                    .where(eq(messageRecords.userId, userId));
                console.log("Updated existing record");
     
            } else {
                // If record does not exist, insert a new record
                await db.insert(messageRecords).values({
                    userId: userId,
                    numberOfMessages: 1, // Start with 1 message
                });
                console.log("Inserted new record");
                
            }

            },
            
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
