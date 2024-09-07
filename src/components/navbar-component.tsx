

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from './mobile-sidebar';
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";




type Props = {
};

const NavbarComponent =async () => {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  
  if (_chats.length === 0 || !_chats) {
    return(
      <div>
        No chat found
      </div>
    )
  }
  // const fileKey = await db.select().from(chats).where(eq(chats.id, ))
  // const fileKey = _chats[0].fileKey;

  return (
    <div className='flex justify-between p-4 px-8 items-center'>
      <div>
        <MobileSidebar chats={_chats} />
      </div>

      {/* sound recorder */}
      <div>

      </div>
      <div className='flex   gap-8'>
       <p>Chat</p>
       <p>Dashboard</p>
          <UserButton afterSwitchSessionUrl='/' /> 
      </div>
    </div>
  );
}

export default NavbarComponent;
