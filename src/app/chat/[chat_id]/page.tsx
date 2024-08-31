import React from 'react'
import { auth } from '@clerk/nextjs/server'
import ChatSideBar from '@/components/chatsidebar';
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
    params:{chatId: string; };
}

const ChatPage = async ({params: {chatId}}: Props) => {
    const { userId }: { userId: string | null } = auth()
    if (!userId) {
        return {
            redirect: {
            destination: '/sign-in',
            permanent: false,
            },
        }
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  return (
    <div className='flex max-h-screen overflow-scroll'>
        <div className='flex w-full max-h-screen overflow-scroll'>
            
            {/* chat sidebar*/}
            <div className='flex-[1] max-w-xs '>
                <ChatSideBar chatId={parseInt(chatId)} chats={_chats}/>
            </div >
        
                {/* PDF viewer */}
            <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
            
            </div>
                {/* Chat messages component */}   
            <div className='flex-[3] border-1-4 border-1-slate-200'>
                
            </div>
     </div>
       
    </div>

  )
}

export default ChatPage