import type { NextApiRequest, NextApiResponse } from "next";
import { createOrGetUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { clerkId, email } = req.body;
  if (!clerkId || !email) {
    return res.status(400).json({ error: "Missing clerkId or email" });
  }
  try {
    // Debug log
    console.log("Creating or getting user:", { clerkId, email });
    const user = await createOrGetUser(clerkId, email);
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Failed to create user", err);
    return res.status(500).json({ error: "Failed to create user" });
  }
}
