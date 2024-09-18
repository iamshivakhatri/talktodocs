"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, MoreVertical, Delete, PenTool } from "lucide-react";
import axios from "axios";
import { DeleteModal } from "./modals/delete-modal";
import toast from "react-hot-toast";
import { UploadModal } from "./modals/upload-modal";
import { useRouter } from 'next/navigation';
import { useChat } from "@/context/chat-provider";
import { FreeCounter } from "./free-counter";
import { useProModal } from "@/hooks/use-pro-modal";
import { MAX_FREE_COUNTS } from "@/constant";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  fileKey: string;
  isPro: boolean;
  numberOfMessages: number;
};

const ChatSideBar = ({ chats, chatId, fileKey, isPro, numberOfMessages }: Props) => {
  const [opendelete, setOpenDelete] = useState(false);
  const [openupload, setOpenUpload] = useState(false);
  const [loadingdelete, setLoadingDelete] = useState(false);
  const [loadingupload, setLoadingUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [chatList, setChatList] = useState(chats);
  const { setFileKey, setChatId } = useChat();
  const [dropdownVisibleId, setDropdownVisibleId] = useState<number | null>(null);
  const proModal = useProModal();
  const selectedChatRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    setFileKey(fileKey);
    setChatId(chatId);
  }, [fileKey, chatId, setFileKey, setChatId]);

  useEffect(() => {
    setChatList(chats);
  }, [chats]);

    // Scroll the selected chat into view when it's selected
    useEffect(() => {
      if (selectedChatRef.current) {
        selectedChatRef.current.scrollIntoView({ 
          behavior: "smooth", block: "start" 
        });
      }
      
    }, [chatId]); // Trigger when the selected chat ID changes

  const handleMoreClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownVisibleId(dropdownVisibleId === id ? null : id);
  };

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoadingDelete(true);
      if (!deleteId) return;
      
      const message = await axios.delete('/api/aws', { data: { fileKey: fileKey } });
      const neonResponse = await axios.delete('/api/neon', { data: { chatId: deleteId, fileKey: fileKey } });
      
      // Update the chatList state by filtering out the deleted chat
      setChatList(prevChatList => prevChatList.filter(chat => chat.id !== deleteId));

      // Find the next available chat to redirect to
      const remainingChats = chatList.filter(chat => chat.id !== deleteId);
      const newChatId = remainingChats.length > 0 ? remainingChats[remainingChats.length - 1].id : null;

      if (newChatId) {
        router.push(`/chat/${newChatId}`);
      } else {
        // If there are no more chats, redirect to the home page or show a message
        router.push('/');
      }

      toast.success(message.data);
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    } finally {
      setLoadingDelete(false);
      setOpenDelete(false);
      setDropdownVisibleId(null);
    }
  };


  const handleUpload = () => {
    if (!isPro && numberOfMessages >= MAX_FREE_COUNTS) {
      proModal.onOpen();
    } else {
      setOpenUpload(true);
    }
  };

  return (
    <>
      <DeleteModal
        isOpen={opendelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loadingdelete}
      />
      <UploadModal
        isOpen={openupload}
        onClose={() => setOpenUpload(false)}
        loading={loadingupload}
      />

      <div className="w-full h-full p-4 text-gray-900 flex flex-col">
        <Button className="w-full mb-4" onClick={handleUpload}>
          <PlusCircle className="w-6 h-6 mr-2" />
          Create new chat
        </Button>

        <div className="flex-grow overflow-y-auto space-y-2">
          {chatList.map((chat) => (
            <div 
            key={chat.id}
             className="relative"
             ref={chat.id === chatId ? selectedChatRef : null} // Add ref to the selected chat

             
             >
              <Link href={`/chat/${chat.id}`}>
                <div
                  className={`flex items-center justify-between p-2 rounded-md ${
                    chat.id === chatId
                      ? 'bg-gray-300 text-black'
                      : 'hover:bg-gray-300 hover:bg-opacity-90'
                  }`}
                >
                  <div className="flex items-center flex-grow overflow-hidden">
                    <MessageCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                    <p className="text-sm truncate">{chat.pdfName}</p>
                  </div>
                  <button
                    onClick={(e) => handleMoreClick(e, chat.id)}
                    className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </Link>
              
              {dropdownVisibleId === chat.id && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {/* <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => console.log('Rename clicked')}
                      >
                        <PenTool className="w-5 h-5 mr-2" />
                        Rename
                      </button>
                    </li> */}
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteId(chat.id);
                          setOpenDelete(true);
                        }}
                      >
                        <Delete className="w-5 h-5 mr-2" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )).reverse()}
        </div>

        <div className="mt-auto pt-4">
          <FreeCounter numberOfMessages={numberOfMessages} isPro={isPro} />
        </div>
      </div>
    </>
  );
};

export default ChatSideBar;