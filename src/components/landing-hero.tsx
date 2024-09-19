"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import TypewriterComponent from "typewriter-effect";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs";

const LandingHero = () => {
    const {isSignedIn} = useAuth();
    const handleStarted = () => {
        
    }

    return ( 
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>Chat with anything</h1>
                <div className="text-zinc-400 text-xs md:text-sm font-normal">
                    Converse with any content. PDF, audio, video, or YouTube—just drop it in.
                    </div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500">
                    <TypewriterComponent
                    options={{
                        strings: ["pdf", "audio", "video", "youtube links"],
                        autoStart: true,
                        loop: true,
                    }}
                    />
                </div>

            </div>

            <div>

               <div className="w-4/5 md:w-3/4 m-auto h-32 sm:h-48 md:h-64 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center p-4 bg-gray-100">
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="audio/*,video/*,application/pdf"
                    multiple
                />
                <label
                    htmlFor="file-upload"
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                >
                    <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18M5 12h7m0 0l-4 4m4-4l4-4"
                    ></path>
                    </svg>
                    <p className="text-gray-500">
                    Drag & drop your audio, video, or PDF files here, or{" "}
                    <span className="text-blue-500 underline">browse</span> to upload
                    </p>
                </label>
                </div>

                <span className="mt-2 mb-2">
                    OR
                </span>    
                <div>
                    <input
                    type="text"
                    id="text-upload"
                    placeholder="Paste a YouTube link"
                    className="w-4/5 md:w-3/4 m-auto text-gray-500 h-12 border-4 border-dashed border-gray-300 rounded-lg text-center p-4 bg-gray-100 "
                    />
                </div>
            </div>

            
            <div>
                <Link href={isSignedIn? "/main": "/signed-up"}>
                 <Button variant="price" className="rounded-full" onClick={handleStarted}>
                    Try For Free
                </Button>
                </Link>

            </div>

            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No card required for students.
            </div>

        </div>
     );
}
 
export default LandingHero;