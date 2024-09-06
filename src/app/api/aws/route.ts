import { deleteFromS3 } from "@/lib/db/s3-server";
import { fileURLToPath } from "url";
import { chats} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {db} from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { deleteFromPinecone } from "@/lib/db/pinecone";



export async function DELETE(req:Response, res: Response){
    try {
        const body = await req.json();
        const { fileKey } = body;
        await deleteFromS3(fileKey);
        await deleteFromPinecone(fileKey);
        return new NextResponse("File deleted successfully", { status: 200 });

   
    }catch(error){
        console.error(error);
        return new NextResponse ("Error", {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
      // Use the chatId from the params
      const { searchParams } = new URL(req.url);
      const chatId = searchParams.get('chatId'); 

        // If chatId is null or cannot be converted to a number, handle error
     if (!chatId || isNaN(Number(chatId))) {
        throw new Error("Invalid chatId provided in get api");
      }
  
      // Convert chatId to a number since chats.id expects a number
      const numericChatId = Number(chatId);
    //   Your logic to query the database using chatId
      const result = await db.select().from(chats).where(eq(chats.id, numericChatId ));
      const fileKey = result[0].fileKey;
      console.log("file_key", fileKey);
  
      return NextResponse.json({ fileKey }, { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Error", { status: 500 });
    }
  }