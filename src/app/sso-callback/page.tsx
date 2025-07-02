"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";

export default function SsoCallback() {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const storeUser = async () => {
			if (!user) return;

			try {
				const res = await fetch("/api/user", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						clerkId: user.id,
						email: user.primaryEmailAddress?.emailAddress,
					}),
				});

				if (!res.ok) {
					const data = await res.json();
					throw new Error(data.error || "Failed to store user");
				}

				// Optionally reload to ensure session/user state is fresh
				router.replace("/");
			} catch (err: any) {
				setError(err.message || "Failed to store user");
			}
		};

		if (isLoaded && user) {
			storeUser();
		}
	}, [isLoaded, user, router]);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen text-red-500">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Spinner />
			<span className="ml-2">Setting up your account...</span>
		</div>
	);
}

