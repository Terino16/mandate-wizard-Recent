import { ChatPageClient } from "./_components/ChatPageClient";
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";



export default async function ChatPage() {
  
  const session = await auth.api.getSession({
    headers: await headers() 
})

  if(!session?.user)
  {
    redirect("/login")
  }


const user = await prisma.user.findUnique({
  where: { id: (session.user as any).id  },
  select: { credits: true, name: true, id: true }
});

  return (
    <ChatPageClient initialCredits={user?.credits} />
  );
}
