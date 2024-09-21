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