import React from 'react'
import { Message } from 'ai/react'
import {cn} from "@/lib/utils"
import ReactMarkdown from "react-markdown";

type Props = {
  messages: Message[],
  onPromptClick: (text: string) => void;
}

const MessageList = ({messages,  onPromptClick }: Props) => {
  const handlePrompt = (text: string) => {  
    onPromptClick(text);
  }
  if (!messages) return <>  </>
  return (
    <>
   
   
      {messages.length>0 ? 

        <div >
        {messages.map((message) => (
          <div key={message.id} className={cn('flex mb-3', {"justify-end pl-10": message.role === "user", "justify-start ": message.role ==="assistant"})}>
           <div className={cn("rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10 ", {"bg-gray-900 text-white": message.role === "user", "w-3/5": message.role === "assistant"})}>
            {/* <p>{message.content}</p> */}
            <ReactMarkdown 
                            className="text-sm overflow-hidden leading-7 "
                            components={{
                                pre: ({ node, ...props }) => (
                                    <div className="overflow-auto w-3/4 my-2 bg-black/10 p-2 rounded-lg border-blac-10">
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
 
      :
      (
        <div className="text-gray-900 flex items-center justify-center h-full">
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            <div onClick={()=>{handlePrompt("What is this document about?")}} className="text-gray-900 text-sm flex items-center justify-center
             hover:bg-gray-200 h-28 w-28 rounded-lg shadow-md p-2 cursor-pointer">
              What is this document about?
            </div>
            <div onClick={()=>{handlePrompt("Key takeaways from this document?")}} className="text-gray-900 text-sm flex items-center justify-center
             hover:bg-gray-200 h-28 w-28 rounded-lg shadow-md p-2 cursor-pointer">
              Key takeaways from this document?
            </div>
            <div onClick={()=>{handlePrompt("Who is the target audience?")}} className="text-gray-900 text-sm flex items-center justify-center
             hover:bg-gray-200 h-28 w-28 rounded-lg shadow-md p-2 cursor-pointer">
              Who is the target audience?
            </div>
            <div onClick={()=>{handlePrompt("Any actionable insights?")}} className="text-gray-900 text-sm flex items-center justify-center
             hover:bg-gray-200 h-28 w-28 rounded-lg shadow-md p-2 cursor-pointer">
              Any actionable insights?
            </div>
          </div>

        </div>
      )
      
      
      }
    </>
  )
}

export default MessageList