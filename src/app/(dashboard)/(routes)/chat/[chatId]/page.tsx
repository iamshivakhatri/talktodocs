import React from "react";
import { auth } from "@clerk/nextjs/server";
import ChatSideBar from "@/components/chatsidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import PDFViewer from "@/components/pdf-viewer";
import ChatComponent from "@/components/chat-component";
import SummaryComponent from "@/components/summary-component";
import NavbarComponent from "@/components/navbar-component";
import { checkSubscription } from "@/lib/subscription";
import { apiLimit } from "@/lib/api-limit";
// type Props = {
//     params:{chatId: string; };
// }

type Props = {
  params: { chatId: string };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId }: { userId: string | null } = auth();
  console.log("this is userId", userId);  
  const isPro = await  checkSubscription();

  if (!userId) {
    return redirect("/sign-in");
  }

  let numberOfMessages = await apiLimit();
  if(!numberOfMessages){
    numberOfMessages = 0;
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));


  // console.log("This is _chats after deletion", _chats);

  if (_chats.length === 0 || !_chats) {
    return(
      <div>
        No chat found
      </div>
    )
  }
  // const fileKey = _chats[0].fileKey;

// if somebody manually tries to access a chat that doesn't exist, redirect them to the last chat
  let currentChat = _chats.find((chat) => chat.id === parseInt(chatId));


  if(!currentChat){
    currentChat = _chats[_chats.length - 1];
    if (!currentChat) {
      return <div>No chat found</div>;
    }
    chatId = currentChat.id.toString();
  //  _chats = await db.select().from(chats).where(eq(chats.userId, userId)); 
    redirect(`/chat/${chatId}`)
  }
  const fileKey = currentChat.fileKey;

  console.log("this is filekey selected in chatpage", fileKey);
  console.log("this is chatId selected in chatpage", chatId);

  return (
    // <div className="flex flex-col flex-grow bg-gray-100 h-full">
      <>
      {/* <div className="sticky top-0 z-50  bg-gray-900 text-white  border-gray-400">
        <NavbarComponent />
      </div>
     */}

      <div className="flex flex-grow overflow-hidden mx-auto w-full 2xl:w-4/5">
        <div className="flex w-full  h-full">
          {/* chat sidebar*/}
          <div className="hidden md:block flex-[2] lg:flex-[1] max-w-48 lg:max-w-xs ">
            <ChatSideBar chatId={parseInt(chatId)} chats={_chats} fileKey={fileKey} isPro={isPro} numberOfMessages={numberOfMessages}/>
          </div>

          {/* PDF viewer */}
          {/* <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
              <PDFViewer pdf_url={currentChat?.pdfUrl|| " " }/>
            
            </div> */}
          {/* Chat messages component */}
          <div className="flex-[5] lg:flex-[5] border-1-4 border-1-slate-200">
            <ChatComponent chatId={parseInt(chatId)} />
          </div>

          <div className="hidden sm:block flex-[4] lg:flex-[4] h-full p-4 bg-gray-100 border-l-2">
            <SummaryComponent chatId={parseInt(chatId)} />
          </div>
        </div>
      </div>
      </>
    // </div>
  );
};

export default ChatPage;
