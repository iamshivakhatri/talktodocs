import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const POST = async(req: Request, res: Response)=> {
    const body = await req.json();
    const { chatId } = body;
    const _messages = await db.select().from(messages).where(eq(messages.chatId, chatId));

    return NextResponse.json(_messages, {status: 200});

}