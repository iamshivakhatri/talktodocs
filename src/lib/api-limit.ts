import {auth} from '@clerk/nextjs/server';
import { db } from './db';

export const apiLimit = async () => {
    const {userId}: {userId: string | null} = auth();
    if (!userId) {
        return;
    }

}

export const increaseMessage = async (req: Request) => {
    try{

    }catch(e){
        console.error(e);
    }
   
}

