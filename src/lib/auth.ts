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
  console.log("Attempting to create/get user:", { clerkId, email });
  
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      console.log("User not found, creating new user");
      user = await prisma.user.create({
        data: {
          id: clerkId,
          clerkId,
          email
        }
      });
      console.log("Created new user:", user);
    } else {
      console.log("Found existing user:", user);
    }

    return user;
  } catch (error) {
    console.error("Error in createOrGetUser:", error);
    throw error;
  }
}
