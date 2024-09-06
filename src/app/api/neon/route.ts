import { deleteChat, deleteMessage, deleteSummary } from "@/lib/db/neon";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try{
        const body = await req.json();
        const { chatId, fileKey } = body;
        console.log("deleting summary with chatid", chatId);
        await deleteSummary(chatId);
        console.log("deleting message with chatid", chatId);
        await deleteMessage(chatId);
        console.log("deleting chat with filekey", fileKey, chatId);
        await deleteChat(fileKey);
       
        return new NextResponse("File deleted successfully", { status: 200 });

    }catch(error){
        console.error(error);
        return new NextResponse("Error", { status: 500 });

    }
    



}