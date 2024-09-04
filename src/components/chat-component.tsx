"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import MessageList from "./message-list";
import React, { useRef, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Message } from "ai";


type Props = {chatId: number};




const ChatComponent = ({chatId}: Props) => {

    const {data, isLoading} = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/get-messages/', {chatId});
            return response.data;
        }
    })

    console.log("This is data in chat component", data);

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: data|| [],
  });

    // Ref to the end of the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom when messages change
    useEffect(() => {
      console.log("This is messages in useEffect", messages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

  console.log("This is messages in usechat", messages);
  return (
    <div className="flex flex-col h-full border-l-2">
      {/* header */}
      {/* <div className="bg-gray-900 text-white p-4">
        <h3 className="text-xl font-bold">Chat</h3>
      </div> */}

      {/* message list */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} >

       </div>
      </div>

       {/* Empty div to help with scrolling */}
      

      {/* input form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 border-t"
      >
        <div className="flex items-center">
          <Input
            value={input}
            onChange={handleInputChange}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none shadow-lg"
            placeholder="Ask any question..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
