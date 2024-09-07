import { eq } from "drizzle-orm";
import { chats, messages, summary } from "./schema";
import { db } from ".";

export async function deleteChat(chatId: number) {
    try {

        // Your logic to delete the chat
        console.log("chatid in the delete chat", chatId);
        const deletedUser = await db.delete(chats).where(eq(chats.id, chatId));
        console.log("deleted user", deletedUser);
    } catch (error) {
        console.error(error);
    }
}


export async function deleteMessage(chatId:number){
    try{
        console.log("fileKey in the delete message", chatId);
        // Your logic to delete the message
        const deletedmsg = await db.delete(messages).where(eq(messages.chatId, chatId));
        console.log("deleted message", deletedmsg);
    }catch(error){
        console.error(error);
    }
}

export async function deleteSummary(chatId:number) {
    try {
        console.log("fileKey in the delete summary", chatId);
        // Your logic to delete the summary
        const deletedSummary = await db.delete(summary).where(eq(summary.chatId, chatId));
        console.log("deleted summary", deletedSummary);
    } catch (error) {
        console.error(error);
    }
}