"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import TypewriterComponent from "typewriter-effect";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

const LandingHero = () => {
    const { isSignedIn } = useAuth();

    const handleStarted = () => {
        // Add your logic here
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white font-bold py-36 text-center space-y-8"
        >
            <motion.div 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="mb-4">Chat with Anything</h1>
                <div className="text-zinc-300 text-sm md:text-base font-normal max-w-2xl mx-auto">
                    Unlock the power of conversation with any content. From PDFs to YouTube videos, just drop it in and start chatting!
                </div>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500">
                    <TypewriterComponent
                        options={{
                            strings: ["PDFs", "Audio Files", "Video Clips", "YouTube Links"],
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 50,
                            delay: 80,
                        }}
                    />
                </div>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link href={isSignedIn ? "/main" : "/sign-up"}>
                    <Button 
                        variant="price" 
                        className="rounded-full px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition-all duration-300"
                        onClick={handleStarted}
                    >
                        Start Chatting Now
                    </Button>
                </Link>
            </motion.div>

            <motion.div 
                className="text-zinc-400 text-sm font-normal mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                No credit card required for students. Start for free today!
            </motion.div>
        </motion.div>
    );
}

export default LandingHero;