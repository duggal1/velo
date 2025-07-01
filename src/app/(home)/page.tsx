import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";

import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import HumanoidSection from "@/components/scroll-section";




export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full ">
      {/* Full viewport background gradient */}
     
 <div
        className="fixed inset-0 -z-10 w-screen h-screen"
        style={{
          background: `
            radial-gradient(ellipse 200% 150% at 50% 100%, 
              rgba(255, 215, 0, 0.95) 0%, 
              rgba(255, 193, 7, 0.9) 10%, 
              rgba(255, 165, 0, 0.8) 20%, 
              rgba(255, 140, 0, 0.7) 30%, 
              rgba(255, 69, 0, 0.6) 40%, 
              rgba(0, 0, 0, 0.5) 60%, 
              rgba(0, 0, 0, 0.6) 70%, 
              rgba(0, 0, 0, 0.7) 80%, 
              rgba(0, 0, 0, 0.8) 90%, 
              rgba(0, 0, 0, 0.95) 100%),
            radial-gradient(ellipse 180% 120% at 50% 0%, 
              rgba(0,0,0,1) 0%,
              rgba(0,0,0,0.98) 8%,
              rgba(0,0,0,0.95) 16%,
              rgba(0,0,0,0.7) 28%,
              rgba(0,0,0,0.5) 45%,
              rgba(255, 69, 0, 0.15) 60%,
              rgba(255, 140, 0, 0.10) 75%,
              rgba(255, 215, 0, 0.05) 90%,
              transparent 100%
            ),
            linear-gradient(135deg, 
              rgba(0,0,0,0.3) 0%,
              rgba(0,0,0,0.1) 50%, 
              rgba(255, 215, 0, 0.1) 100%),
            #0a0a0a
          `
        }}
      />
      {/* Bright center glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% 80%, 
              rgba(255, 215, 0, 0.4) 0%, 
              rgba(255, 165, 0, 0.2) 30%, 
              rgba(0, 0, 0, 0.1) 60%, 
              transparent 80%)
          `
        }}
      />
      {/* Content */}
      <section className="relative z-10 space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image 
            src="/icons/logo.png"
            alt="lovable-clone"
            width={100}
            height={100}
            className="hidden md:block"
            priority
          />
        </div>
      
        <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight text-white">
          Every second you spend coding <br /> we're already shipping.
        </h1>

        <p className="text-lg md:text-xl text-gray-300/80 text-center max-w-3xl mx-auto">
          Drop a prompt. Get a real, production-ready SaaS app — full-stack,
          fully designed, fully deployed. Before you'd even open VSCode.
        </p>

        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      <SignedIn>
        <div className="relative z-10">
          <ProjectsList />
        </div>
      </SignedIn>
      <HumanoidSection />
      {/* <SpecificationsSection /> */}
    </div>
  );
}