// api/create-chat
import {NextResponse} from "next/server";
import { loadS3IntoPinecone } from "@/lib/db/pinecone";


export async function POST(req: Request, res:Response){
    try{
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log("body", body);
        const pages = await loadS3IntoPinecone(file_key);

        return NextResponse.json({pages });

    }catch(error){
        console.error(error);
        return NextResponse.json({error: 'Failed to create chat'}, {status: 500});
    }
}