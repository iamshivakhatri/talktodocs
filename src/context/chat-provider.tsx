"use client";
import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for chatId and message count
const ChatContext = createContext<{ 
    chatId: number | null, 
    setChatId: React.Dispatch<React.SetStateAction<number | null>> 
    fileKey: string | null,
    setFileKey: React.Dispatch<React.SetStateAction<string | null>>,
    numberOfMessages: number,
    incrementMessages: () => void
}>({
    chatId: null,
    setChatId: () => {},
    fileKey: null,
    setFileKey: () => {},
    numberOfMessages: 0,
    incrementMessages: () => {}
});

// Create a provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatId, setChatId] = useState<number | null>(null);
    const [fileKey, setFileKey] = useState<string | null>(null);
    const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get('/api/limit');
                const data = response.data.numberOfMessages; // Assuming the API returns { numberOfMessages: x }
                setNumberOfMessages(data || 0); // Fallback to 0 if data is undefined or null
                console.log("Number of messages fetched:", data); // Print the value to check
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        getMessages();
    }, []);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to increment the number of messages
    const incrementMessages = async () => {
        try {
            console.log("delay started")
            await delay(3000); // Delay of 1000 milliseconds (1 second)
            console.log("delay ended")
            const response = await axios.get('/api/limit');
            const data = response.data.numberOfMessages; // Assuming the API returns { numberOfMessages: x }
            console.log("this is the data coming from the api   ", data);
            setNumberOfMessages(data || 0); // Fallback to 0 if data is undefined or null
            console.log("Incremented number of messages:", data); // Print the value to check
        } catch (error) {
            console.error("Error incrementing messages:", error);
        }
    };



    return (
        <ChatContext.Provider value={{ chatId, setChatId, fileKey, setFileKey, numberOfMessages, incrementMessages }}>
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook to use the ChatContext
export const useChat = () => {
    return useContext(ChatContext);
};
