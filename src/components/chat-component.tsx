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
  const [shouldSubmit, setShouldSubmit] = React.useState(false); // New flag state

  
  
    const {data, isLoading} = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/get-messages/', {chatId});
            return response.data;
        }
    })


    // useChat is not only hitting the api but also handling the state of the chat like displaying the messages
  const { input, handleInputChange, handleSubmit, messages, setInput } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: data|| [],
  });

  useEffect(() => {
    if (shouldSubmit) {
      handleSubmit(); // Trigger the chat submit
      setShouldSubmit(false); // Reset the flag after submission
    }
  }, [shouldSubmit, input]);


    // Ref to the end of the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Function to handle prompt clicks from MessageList
    const handlePromptClick = (text: string) => {
      setInput(text); // Set the input value
      setShouldSubmit(true); // Set the flag to trigger submission
    };

  return (
    <div className="flex flex-col h-full border-l-2">


      {/* message list */}
      <div className="flex-1 overflow-auto p-4 bg-gray-100">
        <MessageList messages={messages} onPromptClick={handlePromptClick}/>
        <div ref={messagesEndRef} >

       </div>
      </div>


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
