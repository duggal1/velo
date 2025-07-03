"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import Tooltip from "./tooltip";

export default function PricingPage() {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: 'linear-gradient(135deg, #FFA500 0%, #FF4500 100%)'
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>

      {/* Bottom gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] min-h-screen"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: 'linear-gradient(135deg, #FFA500 0%, #FF4500 100%)'
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem] min-h-screen"
        />
      </div>

      <section className="space-y-6 pt-8 2xl:pt-16 mb-0">
        <div className="mb-6 mt-0">
          <Image
            src="/icons/logo.png"
            alt="logo"
            height={68}
            width={68}
            className="mx-auto rounded-full"
          />

          <h1 className="text-4xl font-semibold text-white text-center">
            Simple Pricing
          </h1>
          <p className="text-gray-400 text-lg mb-8 mt-4 text-center">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-8">
            <div className="flex -space-x-2">
              <Tooltip />
            </div>
            <div className="ml-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-600 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
                <span className="text-white font-semibold ml-2">4.9/5</span>
              </div>
              <p className="text-gray-400 text-sm">Trusted by 500,000+ agencies and founders</p>
            </div>
          </div>

          <PricingTable
            appearance={{
              elements: {
                pricingTableCard: "border! shadow-none! rounded-lg!",
              },
              baseTheme: currentTheme === "dark" ? dark : undefined,
            }}
          /> 
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
          <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">30-Day Money Back</h3>
            <p className="text-gray-400 text-sm text-center">Full refund if you're not satisfied</p>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">14-Day Free Trial</h3>
            <p className="text-gray-400 text-sm text-center">Try all features risk-free</p>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur border border-gray-800 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
            </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-400 text-sm text-center">Expert help whenever you need it</p>
          </div>
        </div>
      </section>
    </div>
  );
}