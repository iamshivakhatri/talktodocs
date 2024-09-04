import { auth } from '@clerk/nextjs/server'
import { AudioLinesIcon, PhoneForwardedIcon, UserCircle, Video, Mic, BookOpenText } from 'lucide-react';
import React from 'react'
import { UserButton } from "@clerk/nextjs";
import { Button } from './ui/button';

type Props = {}

const NavbarComponent = (props: Props) => {
    const {userId} = auth();
  return (
    <div className='flex justify-between p-4 px-8 items-center'>
        <div className='flex justify-around gap-6'>
            <Button className='flex gap-2'>
                <Video className='w-8 h-8'/>
            </Button>
            <Button className='flex gap-2'>
                <AudioLinesIcon className='w-8 h-8'/>
            </Button>
            <Button className='flex gap-2'>
                <BookOpenText className='w-8 h-8'/>
            </Button>
            <Button>
                <Mic className='w-8 h-8'/>
            </Button>
            
            
           
        </div>
        <div>
        <UserButton afterSwitchSessionUrl='/' />
        </div>
    </div>
  )
}

export default NavbarComponent