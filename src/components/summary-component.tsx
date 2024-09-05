"use client";
import React, { useEffect, useRef } from 'react';
import { useChat } from "ai/react";
import {cn} from "@/lib/utils"
import { db } from '@/lib/db';
import {  summary as _summary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';



type Props = { chatId: number };

type Message = {
  id?: string; // Optional for CreateMessage
  role: 'function' | 'data' | 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  // Add other properties if needed
};
const SummaryComponent = ({ chatId }: Props) => {




  // Use the useChat hook with the initialInput to automatically send a request

  const { append, messages, setMessages } = useChat({
    api: '/api/summary',
    body: { chatId },
    // Add any additional configurations if needed
  });

  const sendMessage = async (message: Message) => {
    try {
       await append(message);
    } catch (error) {
      console.error('Error:', error);
    }
  }; 


  const effectRan = useRef(false);

  const getSummary = async () => {
    try {
      const response = await axios.post('/api/get-summary/', {chatId});
      const data = await response.data;
      const summary = await data.messages;
      
      return summary;
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }



  useEffect(() => {
    const fetchSummary = async()=>{
      const summary = await getSummary();
          if (summary.length > 0) {
            setMessages(summary);
        }else{
          sendMessage({role: 'user', content: 'Please provide the summary of the given content.',});

        }
    }
    fetchSummary();

    // Cleanup function should return void or nothing
    return () => {
      // No need to return anything here unless cleaning up resources
    };
  }, []); // Empty dependency array ensures effect runs only once



  




  return (
    <div className="bg-gray-100 flex flex-col gap-4 p-6 h-full justify-around">
      {/* Summary Section */}
      <div className="p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 overflow-scroll">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
        <div className="text-gray-600">

        {messages &&  messages.map((message) => (
            (message.role==="user")?  null  : 
            <div key={message.id}>
              <div>
                <p>{message.content}</p>
              </div>
            </div>
           ))} 

      
        </div>
      </div>

      {/* Related Information Section */}
      <div className="p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 scroll-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Related Information</h2>
        <p className="text-gray-600">
          {/* Placeholder text, replace with actual related information */}
          Here is some related information or links that provide additional context or resources.
        </p>
      </div>
    </div>
  );
};

export default SummaryComponent;
