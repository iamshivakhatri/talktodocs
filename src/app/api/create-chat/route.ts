// api/create-chat
import {NextResponse} from "next/server";
import { loadS3IntoPinecone } from "@/lib/db/pinecone";
import { db } from "@/lib/db";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { chats } from "@/lib/db/schema";
import { get } from "http";


export async function POST(req: Request, res:Response){
    const {userId} = await auth()
    if(!userId){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
     try{
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log("body", body);
        await loadS3IntoPinecone(file_key);
        const chatId = await db.insert(chats).values({
            pdfName:file_name,
            pdfUrl: getS3Url(file_key),
            userId: userId,
            fileKey: file_key
        }).returning({insertedId: chats.id});
        console.log("chatId at the backend", chatId);

        return NextResponse.json({chatId: chatId[0].insertedId}, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({error: 'Failed to create chat'}, {status: 500});
    }
}