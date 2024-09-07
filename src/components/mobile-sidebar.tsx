"use client";

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import ChatSideBar from "./chatsidebar";
import { useChat } from "@/context/chat-provider";
import { DrizzleChat } from "@/lib/db/schema";



interface MobileSidebarProps {
    // apiLimitCount: number;
    // isPro: boolean;
    // fileKey: string;
    chats: DrizzleChat[];

}



const MobileSidebar = ({chats}:MobileSidebarProps )=> {
    const [isMounted, setIsMounted] = useState(false);
    const { chatId, fileKey } = useChat(); 

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!chatId) {
        return (
            <div>
                No Valid Chat Id selected.
            </div>
        );
    }

    if(!fileKey){
        return (
            <div>
                No file key selected.
            </div>
        );
    }


    // const chats = [
    //     {
    //       id: 27,
    //       pdfName: 'filip.pdf',
    //       pdfUrl: 'https://sk-chat-app-storage.s3.us-east-2.amazonaws.com/uploads/1725661195751_filip.pdf',
    //       createdAt: "2024-09-06T22:20:11.091Z",
    //       userId: 'user_2lDz1alGNwMOOW8M0JmbxJV2wx0',
    //       fileKey: 'uploads/1725661195751_filip.pdf'
    //     },
    // ]

    return ( 
        <Sheet>
        <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
            <Menu size={24}/>
        </Button>
        </SheetTrigger>
        <SheetContent side = "left" className="p-0 m-0">
        {/* apiLimitCount={apiLimitCount} isPro={isPro} */}
            <ChatSideBar chats ={chats} chatId = {chatId} fileKey = {fileKey}/>
        </SheetContent>
        </Sheet>
     );
}
 
export default MobileSidebar;