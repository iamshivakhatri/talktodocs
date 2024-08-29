// api/create-chat
import {NextResponse} from "next/server";


export async function POST(req: Request, res:Response){
    try{
        const body = await req.json();

    }catch(error){
        console.error(error);
        return NextResponse.json({error: 'Failed to create chat'}, {status: 500});
    }
}