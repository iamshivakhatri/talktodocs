"use client";

import React, { useEffect, useState } from 'react';
import { useChat } from "ai/react";
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import { LoaderCircle as Spinner} from 'lucide-react';
import { useChat as useNum } from "@/context/chat-provider";


type Props = { chatId: number };

type Message = {
  id?: string;
  role: 'function' | 'data' | 'system' | 'user' | 'assistant' | 'tool';
  content: string;
};

const SummaryComponent = ({ chatId }: Props) => {
  const {incrementMessages, numberOfMessages} = useNum(); 

  const { append, messages, setMessages, isLoading } = useChat({
    api: '/api/summary',
    body: { chatId },
    onResponse: (response) => {
      console.log("API response while creating a chat:", response);
      if (response.status === 404) {
        console.error("Error with the API call:", response);
      }else if(response.status === 200){
        incrementMessages();
      }
    },
  });

  // const [loading, setLoading] = useState(true);  // Add loading state

  const sendMessage = async (message: Message) => {
    try {
      await append(message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getSummary = async () => {
    try {
      const response = await axios.post('/api/get-summary/', { chatId });
      const data = await response.data;
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching summary:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getSummary();
      if (summary.length > 0) {
        setMessages(summary);
      } else {
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
      // setLoading(false);  // Set loading to false after fetching summary
    };
    fetchSummary();
  }, []);

  return (
    <div className="bg-gray-100 p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md overflow-auto">
        {isLoading ? (  // Render spinner if loading
          <div className="flex justify-center items-center h-32">
            <Spinner className="w-10 h-10 text-gray-900 animate-spin"  /> {/* You can use any spinner component or a custom loader */}
            

          </div>
        ) : (
          <div className="text-gray-900 text-sm">
            {messages && messages
              .filter(message => message.role !== "user")
              .map(message => (
                <div key={message.id}>
                  <ReactMarkdown
                    className="text-sm leading-7"
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg border-black/10">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-black/10 rounded-lg p-1" {...props} />
                      )
                    }}
                  >
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryComponent;
