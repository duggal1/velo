import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";


export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.userId;
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  return user;
}

export async function createOrGetUser(clerkId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: clerkId,      // Make sure id and clerkId are the same
        clerkId: clerkId,
        email: email
      }
    });
  }

  return user;
}
