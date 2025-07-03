import React from "react";
export function Footer () {
  return (
    <section id="made-by-humans" className="w-full py-0">
      <div className="section-container pb-2">
        {/* Removed the pulse-chip button/element that was here */}
        
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative mt-6 sm:mt-8">
          {/* Full-width, beautiful rounded image */}
          <img
            src="/bg3.jpg"
            alt="Background"
            className="w-full h-[450px] object-cover rounded-2xl sm:rounded-3xl"
            style={{
              display: "block"
            }}
          />
          <div className="absolute inset-0 bg-black/60 rounded-2xl sm:rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 min-h-[250px] sm:min-h-[350px]">
            <div className="flex items-center text-white">
              <img src="/icons/logo.png" alt="Velo Logo" className="h-5 sm:h-6 w-auto mr-3 " />
              <span className="text-white text-xl font-medium"></span>
            </div>
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                marginTop: "40px"
              }}
            >
              <h2
                className="w-full break-words sm:text-5xl font-playfair text-white italic mt-0 mx-0 font-thin text-6xl md:text-7xl py-0 px-0 text-center lg:text-7xl"
                style={{
                  marginBottom: "-30px",
                  padding: "0px 0px 100px",
                  maxHeight: "none",
                  overflow: "visible",
                  wordBreak: "break-word"
                }}
              >
                Built By Builders For Builders
              </h2>
            </div>
            {/* White box at the bottom with overflow */}
            <div className="w-[120%] bg-black h-10 rounded-t-lg absolute left-[-10%] bottom-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};