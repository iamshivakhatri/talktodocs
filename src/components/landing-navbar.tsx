"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';
import { MessageSquare } from 'lucide-react';
import {cn} from "@/lib/utils";
import {useAuth} from "@clerk/nextjs"
import { Button } from './ui/button';

const font = Montserrat({
    weight: "600",
    subsets: ['latin']
});

const LandingNavbar = () => {
    const {isSignedIn} = useAuth();

    
    return ( 
        <nav className="bg-  p-4 flex items-center justify-between">
            <Link href="/" className='flex items-center'>
            <div className='relative w-8 h-8 mr-4 flex items-center'>
                <MessageSquare />
            </div>
            <h1 className={cn("text-2xl font-bold", font.className)}>Chat APP</h1>
            </Link>

            <div>
                <Link href={isSignedIn? "/main": "/sign-up"} className="mr-4">
                <Button variant="outline" className="rounded-full">
                Get Started
                </Button>
                </Link>
            </div>

        </nav>
     );
}
 
export default LandingNavbar;