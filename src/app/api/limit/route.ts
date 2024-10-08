// app/api/limit/route.ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { messageRecords } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET API route to retrieve the message count for the authenticated user
export async function GET() {
    const { userId }: { userId: string | null } = auth();
    
    // Check if the userId is present
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the number of messages for the user
    const messageNumber = await db
        .select({
            numberOfMessages: messageRecords.numberOfMessages,
        })
        .from(messageRecords)
        .where(eq(messageRecords.userId, userId));

    console.log("messageNumber in the api route.", messageNumber);

    // If no records found, return 0
    if (!messageNumber || messageNumber.length === 0) {
        return NextResponse.json({ numberOfMessages: 0 });
    }

    // Return the number of messages
    return NextResponse.json({ numberOfMessages: messageNumber[0].numberOfMessages });
}
