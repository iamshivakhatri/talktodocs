"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from "ai/react";
import {cn} from "@/lib/utils"
import { db } from '@/lib/db';
import {  summary as _summary } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import ReactMarkdown from "react-markdown";



type Props = { chatId: number };

type Message = {
  id?: string; // Optional for CreateMessage
  role: 'function' | 'data' | 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  // Add other properties if needed
};
const SummaryComponent = ({ chatId }: Props) => {
  // const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
// }, []);

// if (!isMounted) return null;




  // Use the useChat hook with the initialInput to automatically send a request

  const { append, messages, setMessages } = useChat({
    api: '/api/summary',
    body: { chatId },
    onResponse: (response) => {
      console.log("API response while creating a chat:", response);
      if (response.status === 404) {
          console.error("Error with the API call:", response);
          return;
      }
  },
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
          sendMessage({
            role: 'user',
            content: `
              Please summarize the given content. Focus on extracting the key points and main ideas. 
              Make sure the summary is clear and easy to understand. 
              Highlight the most important details, and avoid including irrelevant or repeated information.
              Provide a concise overview, capturing the essence of the material.
              Ensure the summary is well-structured and coherent throughout.`
          });
          

        }
    }
    fetchSummary();

    // Cleanup function should return void or nothing
    return () => {
      // No need to return anything here unless cleaning up resources
    };
  }, []); // Empty dependency array ensures effect runs only once



  




  return (
    <div className="bg-gray-100 flex flex-col gap-4 p-2 lg:p-4 h-full justify-around">
      {/* Summary Section */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
      <div className="p-2 lg:p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 overflow-scroll">
        
        <div className="text-gray-900 text-sm">
          

        {messages &&  messages.map((message) => (
            (message.role==="user")?  null  : 
            <div key={message.id}>
              <div>
              <ReactMarkdown 
                            className="text-sm overflow-hidden leading-7"
                            components={{
                                pre: ({ node, ...props }) => (
                                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg border-blac-10">
                                       <pre {...props} />
                                    </div>
                                ),// This is code block which contains the code
                                code: ({node,...props}) => (
                                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                                )// this is small code word in the explanation which will have bg-black/10
                            }}
                        >
                            {message.content || ""}
              </ReactMarkdown>
              </div>
            </div>
           ))} 

      
        </div>
      </div>

      {/* Related Information Section */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Related Information</h2>

      <div className="p-2 lg:p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 scroll-auto">
        <p className="text-gray-900 text-sm">
          {/* Placeholder text, replace with actual related information */}
          Here is some related information or links that provide additional context or resources.
        </p>
      </div>



    </div>
  );
};

export default SummaryComponent;
