import {auth} from '@clerk/nextjs/server';
import { db } from './db';
import { messageRecords } from './db/schema';
import { eq } from 'drizzle-orm';

export const apiLimit = async () => {
    const {userId}: {userId: string | null} = auth();
    if (!userId) {
        return;
    }
    const messageNumber = await db.select({
        numberOfMessages: messageRecords.numberOfMessages
    }).from(messageRecords).where(eq(messageRecords.userId, userId));
    console.log("messageNumber in the api route.", messageNumber);

    if (messageNumber.length === 0 || !messageNumber) {
        return 0;
    }

    return messageNumber[0].numberOfMessages;
}

