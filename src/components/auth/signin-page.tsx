import { SignInPage, Testimonial } from "@/components/ui/sign-in";
import { useSignIn } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
import React from "react";

// Navigation helper that works without Next.js router
const navigateTo = (url: string) => {
	if (typeof window !== 'undefined') {
		window.location.href = url;
	}
};

const sampleTestimonials: Testimonial[] = [
	{
		avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
		name: "Sarah Chen",
		handle: "@sarahdigital",
		text: "Amazing platform! The user experience is seamless and the features are exactly what I needed.",
	},
	{
		avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
		name: "Marcus Johnson",
		handle: "@marcustech",
		text: "This service has transformed how I work. Clean design, powerful features, and excellent support.",
	},
	{
		avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
		name: "David Martinez",
		handle: "@davidcreates",
		text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
	},
];

export function SignInSection() {
	const { signIn, isLoaded, setActive } = useSignIn();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");
	const [showResetPassword, setShowResetPassword] = React.useState(false);
	const [resetEmail, setResetEmail] = React.useState("");
	const [resetSent, setResetSent] = React.useState(false);

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!signIn || !isLoaded) return;
		
		setLoading(true);
		setError("");
		
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === "complete") {
				// Store user in DB after successful sign in
				const userId = result.createdUserId;
				const sessionId = result.createdSessionId;
				if (userId && email) {
					await fetch("/api/user", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ clerkId: userId, email }),
					});
				}
				await setActive({ session: sessionId });
				navigateTo("/");
			} else {
				// Handle cases where additional verification is needed
				console.log("Sign in requires additional steps:", result.status);
				setError("Additional verification required. Please check your email or try again.");
			}
		} catch (err: any) {
			console.error("Error signing in:", err);
			setError(err?.errors?.[0]?.message || "Sign in failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	// Google sign in handler
	const handleGoogleSignIn = async () => {
		if (!signIn || !isLoaded) return;
		setLoading(true);
		setError("");
		try {
			await signIn.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/sso-callback",
			});
		} catch (err: any) {
			console.error("Error with Google sign in:", err);
			setError(err?.errors?.[0]?.message || "Google sign in failed. Please try again.");
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (!signIn || !isLoaded) return;
		
		if (!showResetPassword) {
			setShowResetPassword(true);
			return;
		}

		if (!resetEmail) {
			setError("Please enter your email address.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const signInAttempt = await signIn.create({
				identifier: resetEmail,
			});

			// Find the email code factor and get its emailAddressId (for Clerk v4+)
			let emailAddressId: string | undefined;

			if (
				signInAttempt.supportedFirstFactors &&
				signInAttempt.supportedFirstFactors.length > 0
			) {
				const emailFactor = signInAttempt.supportedFirstFactors.find(
					(f: any) => f.strategy === "reset_password_email_code"
				);
				// Try both possible keys for Clerk versions
				emailAddressId = emailFactor?.emailAddressId || emailFactor?.safeIdentifier;
			}

			if (!emailAddressId) {
				throw new Error("Could not find email address ID for password reset.");
			}

			const resetAttempt = await signIn.prepareFirstFactor({
				strategy: "reset_password_email_code",
				emailAddressId,
			});

			if (resetAttempt) {
				setResetSent(true);
				setError("");
			}
		} catch (err: any) {
			console.error("Error sending reset email:", err);
			setError(err?.errors?.[0]?.message || "Failed to send reset email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateAccount = () => {
		navigateTo("/auth/get-started");
	};

	if (!isLoaded || loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Spinner />
			</div>
		);
	}

	// Show reset password form
	if (showResetPassword) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background text-foreground">
				<div className="w-full max-w-md p-8">
					<div className="flex flex-col gap-6">
						<h1 className="text-4xl md:text-5xl font-semibold leading-tight font-light text-foreground tracking-tighter">
							{resetSent ? "Check your email" : "Reset Password"}
						</h1>
						
						{resetSent ? (
							<div className="space-y-4">
								<p className="text-muted-foreground">
									We've sent a password reset link to <strong>{resetEmail}</strong>. 
									Check your email and follow the instructions to reset your password.
								</p>
								<button
									onClick={() => {
										setShowResetPassword(false);
										setResetSent(false);
										setResetEmail("");
									}}
									className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
								>
									Back to Sign In
								</button>
							</div>
						) : (
							<>
								<p className="text-muted-foreground">
									Enter your email address and we'll send you a link to reset your password.
								</p>

								{error && (
									<div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-2xl">
										{error}
									</div>
								)}

								<div className="space-y-5">
									<div>
										<label className="text-sm font-medium text-muted-foreground">Email Address</label>
										<div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
											<input
												type="email"
												placeholder="Enter your email address"
												value={resetEmail}
												onChange={(e) => setResetEmail(e.target.value)}
												className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
												required
											/>
										</div>
									</div>

									<button
										onClick={handleResetPassword}
										disabled={loading || !resetEmail}
										className="w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? "Sending..." : "Send Reset Link"}
									</button>
								</div>

								<button
									onClick={() => {
										setShowResetPassword(false);
										setError("");
									}}
									className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									← Back to sign in
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-background text-foreground">
			<SignInPageWithError
				heroImageSrc="/bg.jpg"
				testimonials={sampleTestimonials}
				onSignIn={handleSignIn}
				onGoogleSignIn={handleGoogleSignIn}
				onResetPassword={handleResetPassword}
				onCreateAccount={handleCreateAccount}
				error={error}
				loading={loading}
			/>
		</div>
	);
}

// Enhanced SignInPage component that handles errors
interface SignInPageWithErrorProps {
	heroImageSrc?: string;
	testimonials?: Testimonial[];
	onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
	onGoogleSignIn?: () => void;
	onResetPassword?: () => void;
	onCreateAccount?: () => void;
	error?: string;
	loading?: boolean;
}

const SignInPageWithError: React.FC<SignInPageWithErrorProps> = ({
	heroImageSrc,
	testimonials = [],
	onSignIn,
	onGoogleSignIn,
	onResetPassword,
	onCreateAccount,
	error,
	loading,
}) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="min-h-screen flex flex-col lg:flex-row font-geist">
			{/* Left column: sign-in form */}
			<section className="flex-1 flex items-center justify-center p-8">
				<div className="w-full max-w-md">
					<div className="flex flex-col gap-6">
						<h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
							<span className="font-light text-foreground tracking-tighter">Welcome Back</span>
						</h1>
						<p className="animate-element animate-delay-200 text-muted-foreground">
							Sign in to your account to continue
						</p>

						{error && (
							<div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-2xl">
								{error}
							</div>
						)}

						<form className="space-y-5" onSubmit={onSignIn}>
							<div className="animate-element animate-delay-300">
								<label className="text-sm font-medium text-muted-foreground">Email Address</label>
								<div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
									<input
										name="email"
										type="email"
										placeholder="Enter your email address"
										className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
										required
									/>
								</div>
							</div>

							<div className="animate-element animate-delay-400">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium text-muted-foreground">Password</label>
									<button
										type="button"
										onClick={onResetPassword}
										className="text-sm text-violet-400 hover:underline transition-colors"
									>
										Forgot password?
									</button>
								</div>
								<div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
									<div className="relative">
										<input
											name="password"
											type={showPassword ? 'text' : 'password'}
											placeholder="Enter your password"
											className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute inset-y-0 right-3 flex items-center"
										>
											{showPassword ? (
												<EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
											) : (
												<Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
											)}
										</button>
									</div>
								</div>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "Signing In..." : "Sign In"}
							</button>
						</form>

						<div className="animate-element animate-delay-700 relative flex items-center justify-center">
							<span className="w-full border-t border-border"></span>
							<span className="px-4 text-sm text-muted-foreground bg-background absolute">Or continue with</span>
						</div>

						<button
							onClick={onGoogleSignIn}
							disabled={loading}
							className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<GoogleIcon />
							Continue with Google
						</button>

						<p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
							Don't have an account?{' '}
							<a
								href="/auth/get-started"
								onClick={(e) => {
									e.preventDefault();
									onCreateAccount?.();
								}}
								className="text-violet-400 hover:underline transition-colors"
							>
								Create Account
							</a>
						</p>
					</div>
				</div>
			</section>

			{/* Right column: hero image + testimonials */}
			{heroImageSrc && (
				<section className="hidden lg:block flex-1 relative p-4">
					<div
						className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
						style={{ backgroundImage: `url(${heroImageSrc})` }}
					></div>
					{testimonials.length > 0 && (
						<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
							<TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
							{testimonials[1] && (
								<div className="hidden xl:flex">
									<TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
								</div>
							)}
							{testimonials[2] && (
								<div className="hidden 2xl:flex">
									<TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
								</div>
							)}
						</div>
					)}
				</section>
			)}
		</div>
	);
};

// Helper components (add these if they're missing from your imports)
const Eye = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
		<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
	</svg>
);

const EyeOff = ({ className }: { className?: string }) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
	</svg>
);

const GoogleIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
		<path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
		<path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
		<path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
		<path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
	</svg>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
	<div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
		<img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
		<div className="text-sm leading-snug">
			<p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
			<p className="text-muted-foreground">{testimonial.handle}</p>
			<p className="mt-1 text-foreground/80">{testimonial.text}</p>
		</div>
	</div>
);