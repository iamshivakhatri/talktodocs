"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for chatId
const ChatContext = createContext<{ 
    chatId: number | null, 
    setChatId: React.Dispatch<React.SetStateAction<number | null>> 
    fileKey: string | null,
    setFileKey: React.Dispatch<React.SetStateAction<string | null>>
}>({
    chatId:  null,
    setChatId: () => {},
    fileKey: null,
    setFileKey: () => {},
});

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatId, setChatId] = useState<number | null>(null);
    const [fileKey, setFileKey] = useState<string | null>(null);

    return (
        <ChatContext.Provider value={{ chatId, setChatId, fileKey, setFileKey }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use the ChatContext
export const useChat = () => {
    return useContext(ChatContext);
};
