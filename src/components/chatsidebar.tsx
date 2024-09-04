"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import axios from "axios";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({chats, chatId}: Props) => {
  const [loading, setLoading] = React.useState(false);

  const handleSubscription = async()=>{
    try{
      setLoading(true);
      const  response = await axios.get('/api/stripe');
      window.location.href = response.data.url;

    }catch(e){
      console.error(e);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full p-4 text-gray-900 relative ">
      <Link href="/main " className=" border-dashed border-white">
        <Button className="w-full ">
          <PlusCircle className="w-6 h-6 mr-2" />
          Create new chat
        </Button>
      </Link>

      <div className="flex flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
            <div 
            className={`flex justify-between p-2 rounded-md ${
                chat.id === chatId
                  ? "bg-gray-300 text-black" // Selected state: Soft blue background
                  : "hover:bg-gray-300 hover:bg-opacity-90 " // Hover state: Light gray background
              }`}
                
                >
              <MessageCircle className="w-6 h-6 mr-1 m-auto" />
              <p className="text-sm truncate whitespace-nowrap flex-grow">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        )).reverse()}
      </div>

      <div className="absolute bottom-4 left-4">
        <Button className="w-full mt-4 flex" variant="price" onClick={handleSubscription}>
          <PlusCircle className="w-6 h-6 mr-2" />
          <p>Upgrade</p>
        </Button>
        

      </div>


    </div>
  );
};

export default ChatSideBar;
