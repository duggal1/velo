"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function SsoCallback() {
	const router = useRouter();
	const { user, isLoaded } = useUser();

	useEffect(() => {
		const storeUser = async () => {
			if (!user) return;
			await fetch("/api/user", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ clerkId: user.id, email: user.primaryEmailAddress?.emailAddress }),
			});
			router.push("/");
		};
		if (isLoaded && user) {
			storeUser();
		}
	}, [isLoaded, user, router]);

	return <div className="flex items-center justify-center min-h-screen">Setting up your account...</div>;
}
