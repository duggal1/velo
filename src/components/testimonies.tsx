"use client";
import React, { useRef } from "react";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  gradient: string;
  backgroundImage?: string;
}

const testimonials: TestimonialProps[] = [{
  content: "I went from idea to $50K MRR in 3 months with Velo. My developer said it would take 8 months and cost $200K. Fuck traditional development.",
  author: "Marcus Chen",
  role: "Founder, DataFlow SaaS",
  gradient: "from-blue-700 via-indigo-800 to-purple-900",
  backgroundImage: "/background-section3.png"
}, {
  content: "Velo built my entire fintech backend in 2 weeks. My previous team took 6 months and still couldn't handle basic user auth properly.",
  author: "Sarah Rodriguez",
  role: "CEO, PayFlow Solutions",
  gradient: "from-indigo-900 via-purple-800 to-orange-500",
  backgroundImage: "/bg8.avif"
}, {
  content: "The AI understands business logic better than most senior developers I've hired. This isn't just a tool - it's like having a CTO who actually ships.",
  author: "Dr. James Mitchell",
  role: "Founder, MedTech Analytics",
  gradient: "from-purple-800 via-pink-700 to-red-500",
  backgroundImage: "/bg7.jpg"
}, {
  content: "Velo eliminated our entire development bottleneck. We're shipping features daily now instead of waiting months for our dev team to 'prioritize' them.",
  author: "Lisa Park",
  role: "CEO, E-commerce Automation",
  gradient: "from-orange-600 via-red-500 to-purple-600",
  backgroundImage: "/background-section2.png"
}];

const TestimonialCard = ({
  content,
  author,
  role,
  backgroundImage = "/background-section1.png"
}: TestimonialProps) => {
  return <div className="bg-cover bg-center rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden" style={{
      backgroundImage: `url('${backgroundImage}')`
    }}>
      {/* Ultra-blur overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-xl"></div>
      <div className="absolute top-0 right-0 w-24 h-24 z-10"></div>
      
      <div className="relative z-20">
        <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
        <div>
          <h4 className="font-semibold text-xl">{author}</h4>
          <p className="text-white/80">{role}</p>
        </div>
      </div>
    </div>;
};

export function TestimonialsSection () {
  const sectionRef = useRef<HTMLDivElement>(null);

  return <section className="py-12 relative" id="testimonials" ref={sectionRef}> {/* Reduced from py-20 */}
      <div className="section-container">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <span className="inline-flex items-center justify-center text-md font-bold  text-orange-400 mr-2">Success Stories</span>

          </div>
        </div>
        
        <h2 className="text-5xl font-display font-bold mb-12 text-left">Winners Don't Wait</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => <TestimonialCard key={index} content={testimonial.content} author={testimonial.author} role={testimonial.role} gradient={testimonial.gradient} backgroundImage={testimonial.backgroundImage} />)}
        </div>
      </div>
    </section>;
};

