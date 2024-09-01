"use client";
import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import {useChat} from 'ai/react'
import { Send } from 'lucide-react';
import MessageList from './message-list';


type Props = {}

const ChatComponent = (props: Props) => {
    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/chat',
    })

    console.log("This is messages in usechat", messages)
  return (
    <div className='flex flex-col h-screen'>
    {/* header */}
    <div className='bg-gray-800 text-white p-4'>
        <h3 className='text-xl font-bold'>Chat</h3>
    </div>

    {/* message list */}
    <div className='flex-1 overflow-auto p-4 bg-gray-100'>
        <MessageList messages={messages} />
    </div>

    {/* input form */}
    <form onSubmit={handleSubmit} className='bg-white p-4 border-t border-gray-200'>
        <div className='flex items-center'>
            <Input value={input} onChange={handleInputChange} className='flex-1 border border-gray-300 rounded-lg px-4 py-2' placeholder='Ask any question...' />
            <Button type='submit' className='ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg'>
                <Send className='w-4 h-4' />
            </Button>
        </div>
    </form>
</div>

  )
}

export default ChatComponent