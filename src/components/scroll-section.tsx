"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const cards = [
	{
		title: "Developers are fucking expensive and slow as hell",
		label: "Reality Check",
		bg: "url('/background-section1.png')",
		bgPos: "top center",
	},
	{
		title: "No-code tools are toys pretending to be professional",
		label: "The Truth",
		bg: "url('/background-section2.png')",
		bgPos: "center",
	},
	{
		title: (
			<>
				Velo builds{" "}
				<span className="text-[#FC4D0A]">real SaaS apps</span> that actually
				work
			</>
		),
		label: "The Solution",
		bg: "url('/background-section3.png')",
		bgPos: "bottom center",
	},
];

const HumanoidSection = () => {
	const sectionRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (!sectionRef.current) return;
			const section = sectionRef.current;
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const windowHeight = window.innerHeight;
			const scrollY = window.scrollY;

			// The scrollable area for the sticky effect
			const start = sectionTop;
			const end = sectionTop + sectionHeight - windowHeight;

			// Clamp scrollY between start and end
			const clampedScroll = Math.min(Math.max(scrollY, start), end);

			// Progress from 0 to 1 as user scrolls through the sticky section
			const prog = (clampedScroll - start) / (end - start);
			setProgress(prog);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Card index based on progress
	const activeCardIndex =
		progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

	return (
		<div
			ref={sectionRef}
			className="relative"
			style={{ height: "300vh" }}
		>
			<section
				className="w-full h-screen sticky top-0 overflow-hidden bg-transparent"
				id="why-humanoid"
			>
				<div className="container px-6 lg:px-8 mx-auto h-full flex flex-col">
					<div className="mb-2 md:mb-3">
						<div className="flex items-center gap-4 mb-2 md:mb-2 pt-8 sm:pt-6 md:pt-4">
							<div
								className="pulse-chip opacity-0 animate-fade-in"
								style={{
									animationDelay: "0.1s",
								}}
							>
								<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
									02
								</span>
								<span>The Problem</span>
							</div>
						</div>
						<h2 className="section-title text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-1 md:mb-2">
							Why You&apos;re Still Stuck
						</h2>
					</div>
					<div className="relative flex-1 perspective-1000">
						{cards.map((card, idx) => {
							const isActive = idx === activeCardIndex;
							return (
								<motion.div
									key={idx}
									className="absolute inset-0 overflow-hidden shadow-xl"
									initial={{ opacity: 0, scale: 0.95, y: 100 }}
									animate={
										isActive
											? {
													opacity: 1,
													scale: 1,
													y:
														idx === 0
															? 90
															: idx === 1
															? 55
															: 15,
											  }
											: { opacity: 0, scale: 0.95, y: 200 }
									}
									transition={{
										duration: 1.2,
										ease: [0.19, 1, 0.22, 1],
									}} // <-- slower transition
									style={{
										height: "60vh",
										maxHeight: "600px",
										borderRadius: "20px",
										zIndex: 10 + idx * 10,
										pointerEvents: isActive ? "auto" : "none",
									}}
								>
									<div
										className="absolute inset-0 z-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"
										style={{
											backgroundImage: card.bg,
											backgroundSize: "cover",
											backgroundPosition: card.bgPos,
											backgroundBlendMode: "overlay",
										}}
									></div>
									<div className="absolute top-4 right-4 z-20">
										<div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-transparent/20 backdrop-blur-sm text-white">
											<span className="text-sm font-medium">
												{card.label}
											</span>
										</div>
									</div>
									<div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
										<div className="max-w-lg">
											<h3 className="text-2xl sm:text-3xl md:text-4xl font-display text-white font-bold leading-tight mb-4">
												{card.title}
											</h3>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HumanoidSection;