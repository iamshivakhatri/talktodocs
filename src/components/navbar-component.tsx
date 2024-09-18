

import { UserButton } from "@clerk/nextjs";
import MobileSidebar from './mobile-sidebar';
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/subscription";
import { apiLimit } from "@/lib/api-limit";
import RecordAndPlayAudio from "./record-and-play-audio";






type Props = {
};

const NavbarComponent =async () => {

  
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const isPro = await checkSubscription();
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  let numberOfMessages = await apiLimit();
  if(!numberOfMessages){
    numberOfMessages = 0;
  }

  
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
      <div className="flex  justify-around">

     
      <div>
        <MobileSidebar chats={_chats}  isPro={isPro} numberOfMessages={numberOfMessages} />
      </div>

      <div>
        <RecordAndPlayAudio isPro={isPro} numberOfMessages={numberOfMessages}/>
      </div>


      </div>


      {/* sound recorder */}
      <div>

      </div>
      <div className='flex gap-8'>
          <UserButton afterSwitchSessionUrl='/' /> 
      </div>
    </div>
  );
}

export default NavbarComponent;
