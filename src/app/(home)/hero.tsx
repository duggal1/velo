import Image from "next/image";
import  {ProjectForm}  from "@/modules/home/ui/components/project-form";
import { TextEffect } from "@/components/ui/text-effect";

export function Hero () {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{
          background: 
            `radial-gradient(ellipse 120% 80% at 50% 100%, 
              #FF5E00 0%,        /* Extremely bright orange at the bottom */
              #FF5E00 30%,       /* Keep orange strong up to 30% */
              #2740A6 55%,       /* Deep royal blue in the middle (30%-70%) */
              #000 100%          /* Pure black at the top */
            )`,
          backgroundAttachment: "scroll"
        }}
      />
      {/* Bright center glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 
            `radial-gradient(ellipse 100% 80% at 50% 80%, 
              rgba(255, 215, 0, 0.4) 0%, 
              rgba(255, 165, 0, 0.2) 30%, 
              rgba(0, 0, 0, 0.1) 60%, 
              transparent 80%)`
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
            className="hidden md:block blur-3xl"
            priority
          />
        </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-center leading-tight text-white">
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
      {/* <SpecificationsSection /> */}
    </div>
  );
}