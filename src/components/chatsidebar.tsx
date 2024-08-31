"use client";
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';



type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({chats, chatId}: Props) => {
  return (
    <div w-full h-screen p-4 text-gray-200 bg-gray-900>
        <Link href="/main">
           <Button className='w-full'>
                <PlusCircle className='w-6 h-6'/>
                Create new chat
            </Button>
        </Link>

    </div>
  )
}

export default ChatSideBar