"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Ellipsis, Delete, PenTool } from "lucide-react";
import axios from "axios";
import { DeleteModal } from "./modals/delete-modal";
import toast from "react-hot-toast";
import { UploadModal } from "./modals/upload-modal";
import { useRouter } from 'next/navigation';


type Props = {
  chats: DrizzleChat[];
  chatId: number;
  fileKey: string;
};

const ChatSideBar = ({chats, chatId, fileKey}: Props) => {
  console.log("This is fileKey in the chatSidebar", fileKey);
  const [opendelete, setOpenDelete] = useState(false);
  const [openupload, setOpenUpload] = useState(false);
  const [loadingdelete, setLoadingDelete] = React.useState(false);
  const [loadingupload, setLoadingUpload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter(); // Initialize the router
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [chatList, setChatList] = useState(chats);

   // Update chatList whenever the chats prop changes
   useEffect(() => {
    setChatList(chats);
  }, [chats]);


  const [dropdownVisibleId, setDropdownVisibleId] = useState<number | null>(null);

  // Toggle dropdown on ellipsis click
  const handleEllipsisClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevents navigation if it's in a link
    setDropdownVisibleId(dropdownVisibleId === id ? null : id);
  };

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

  const onDelete = async ()=>{
    try{
      setLoadingDelete(true);
      if(!deleteId){
        return;
      }
      console.log("We are deleting the id ", deleteId);
      const chatId = deleteId;
      console.log("This is printing from ondelete function with fileKey", fileKey);
      console.log("This is the chatId in the ondelete function", chatId);
        const message = await axios.delete('/api/aws', { data: {fileKey: fileKey} }); // this deletes the data from s3 and pinecone
        const neonResponse = await axios.delete('/api/neon', { data: { chatId: chatId, fileKey: fileKey } });
        console.log("This is printing from ondelete function from neonResponse", neonResponse);
        const newChatId = chats[chats.length - 1].id;
        console.log("This is printing from ondelete function newChatId", newChatId);
        router.push(`/chat/${newChatId}`);
        toast.success(message.data);   
    }catch(error){
      console.error("This is printing from ondelete function catch block", error);
    }finally{
      console.log("This is printing from ondelete function finally block");
      setLoadingDelete(false);
      setOpenDelete(false);
      setDropdownVisibleId(null);
       
    
    }
}

  const upload = async()=>{
    try{
      setLoadingUpload(true);
      console.log("This is printing from upload function");
      toast.success("Chat uploaded successfully");


  }catch(error){
    setLoadingUpload(false);
    setOpenUpload(false);
  }finally{
    console.log("This is printing from upload function finally block");
    setLoadingUpload(false);
    setOpenUpload(false);
    setDropdownVisibleId(null);
  }
}

  return (
  <>

     <DeleteModal
        isOpen={opendelete}
        onClose={()=> setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loadingdelete}
         />
     <UploadModal
        isOpen={openupload}
        onClose={()=> setOpenUpload(false)}
        loading={loadingupload}
     />

    <div className="w-full h-full p-4 text-gray-900 relative ">
    {/* href="/main "  */}
      <div className=" border-dashed border-white">   
        <Button className="w-full" onClick={()=>setOpenUpload(true)}>
          <PlusCircle className="w-6 h-6 mr-2" />
          Create new chat
        </Button>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {chatList.map((chat) => (
          <Link href={`/chat/${chat.id}`} key={chat.id}>
          <div
            className={`relative flex items-center justify-between p-2 rounded-md w-full ${
              chat.id === chatId
                ? 'bg-gray-300 text-black'
                : 'hover:bg-gray-300 hover:bg-opacity-90'
            }`}
          >
             <div className="flex items-center w-full">
                <MessageCircle className="w-6 h-6 mr-2" />
                <p className="text-sm w-4/6 overflow-hidden whitespace-nowrap">
                  {chat.pdfName.length > 23 ? `${chat.pdfName.slice(0, 23)}...` : chat.pdfName}
                </p>
              </div>
    
            {/* Ellipsis Icon: Hidden by default, shown on hover */}
            <div className="relative">
              <Ellipsis
                className="w-6 h-6 opacity-0 hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => handleEllipsisClick(e, chat.id)}
              />
              
              {/* Dropdown Menu: Visible only when ellipsis is clicked for this particular chat */}
              {dropdownVisibleId === chat.id && (
                <div className="absolute -right-32 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <ul className="text-left">
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log('Rename clicked')}
                    >
                      <div className="flex gap-x-2">
                      <PenTool className="w-6 h-6 mr-2" />
                       <div>Rename</div>
                      </div>
                     
                    </li>
                    <li
                      className="p-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        // e.stopPropagation(); // Prevent link navigation
                        setDeleteId(chat.id);
                        setOpenDelete(true);

                      }}

                    >
                      <div className="flex gap-x-2">
                      <Delete className="w-6 h-6 mr-2" />
                      <p >Delete</p>
                      </div>
                      
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
  </>
  );
};

export default ChatSideBar;
