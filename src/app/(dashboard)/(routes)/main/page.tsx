import FileUpload from "./components/file-upload";

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const DashboardPage = async () => {


    const { userId }: { userId: string | null } = auth();
    if (!userId) {
        return redirect("/sign-in");
      }

    const _chats = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));



      

    return ( 
        <>
        <div>
        <FileUpload  chats={_chats}/>
        </div>
        </>
    );
}


 
export default DashboardPage;