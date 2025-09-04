import { FeatureCard } from '../components/FeatureCard';
import { BrainCircuit, BookOpen, Camera, Compass } from 'lucide-react';
import type { LucideProps } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';

const featuresData: {
  title: string;
  icon: React.FC<LucideProps>;
  content: string;
}[] = [
  {
    title: "Unlock Spoken Knowledge",
    icon: BrainCircuit,
    content: "From rambling voice notes to formal lectures, we transcribe and summarize audio so you can pinpoint the brilliant ideas buried within."
  },
  {
    title: "The Smartest Way to Read",
    icon: BookOpen,
    content: "Your reading list is long, but your time is short. Feed our AI any book or PDF to receive insightful summaries that let you absorb vast knowledge with ease."
  },
  {
    title: "Ideas, Captured in a Flash",
    icon: Camera,
    content: "A photo of a brainstorm on a whiteboard or a slide from a talk becomes a fully digitized and organized note, ready for you to build upon."
  },
  {
    title: "Navigate Your Data with Conversation",
    icon: Compass,
    content: "Chat directly with your documents, transcripts, and notes. Ask complex questions and let our AI guide you to the precise answer hidden in your content."
  }
];

export const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Set visibility based on whether the section is in the viewport
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        // Clean up the observer when the component unmounts
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const lineStyle = (length: number, delay: string) => ({
    strokeDasharray: length,
    strokeDashoffset: isVisible ? 0 : length,
    transition: `stroke-dashoffset 1.5s ease-out ${delay}`,
  });

  return (
    <div className="bg-black">
        <div className="relative flex h-screen bg-black text-white overflow-hidden">
        {/* Left side content */}
        <div className="flex flex-col justify-center items-start w-1/2 px-12 z-10">
          <h1 className="text-5xl font-bold mb-6">Take Smarter Notes with <span className="block text-center bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent pb-5 font-serif">Synapse Notes</span></h1>
          <p className="text-lg text-gray-300 mb-6">
            Transform your learning with AI-powered note-taking. Capture lectures, digitize whiteboards, 
            and generate intelligent summaries automatically.
          </p>
          <div className="flex justify-center items-center  pl-35  space-x-8">
              <button className="bg-purple-500 hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] text-xl px-6 py-3 rounded-4xl font-semibold ">
              Try Now
              </button>
              <button className=" hover:bg-white/20 text-xl transition border-2 border-purple-400 px-6 py-3 rounded-4xl font-semibold shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.9)]">
              Learn More
              </button>
          </div>
          
        </div>

        {/* Right side spotlight */}
        <div className="relative flex justify-center items-center w-1/2">
          {/* Main spotlight cone */}
          <div className="absolute top-0 h-[900px] w-[1000px] 
                          bg-gradient-to-b from-pink-300/40 via-pink-200/15 to-transparent 
                          blur-[160px] 
                          [clip-path:polygon(50%_0%,0%_100%,100%_100%)]"></div>

          {/* Soft radial glow at source */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 
                          w-[180px] h-[180px] 
                          bg-pink-400/40 rounded-full blur-[100px]"></div>

          {/* Glow on floor */}
          <div className="absolute bottom-10 w-[380px] h-[140px] 
                          bg-pink-300/20 rounded-full blur-[120px]"></div>

          {/* Images */}
          <div className="relative z-10 flex flex-col items-center space-y-10">
            {/* Logo on top */}
            <img
              src="/logo.png"
              alt="Logo"
              className="w-44 h-auto drop-shadow-[0_0_30px_rgba(255,182,193,0.7)] animate-float"
            />

            {/* Two images side by side */}
            <div className="flex space-x-10">
              <img
                src="/girl.png"
                alt="Preview 1"
                className="w-80 h-auto rounded-xl shadow-lg drop-shadow-[0_0_30px_rgba(255,182,193,0.6)] animate-float"
              />
              <img
                src="/books.png"
                alt="Preview 2"
                className="w-80 h-auto rounded-xl shadow-lg drop-shadow-[0_0_30px_rgba(255,182,193,0.6)] animate-float delay-300"
              />
            </div>
          </div>
        </div>
      </div>
      {/*Features*/}
      <section ref={sectionRef} id="feature" className="bg-black py-20 px-4 relative overflow-hidden">
      {/* SVG Overlay for drawing hardcoded lines. */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 800">
            <path d="M500 180 L500 250 L300 250 L300 350" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" fill="none" style={lineStyle(370, '0s')}/>
            <path d="M500 180 L500 250 L700 250 L700 350" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" fill="none" style={lineStyle(370, '0.2s')}/>
            <path d="M500 180 L500 500 L300 500 L300 600" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" fill="none" style={lineStyle(620, '0.4s')}/>
            <path d="M500 180 L500 500 L700 500 L700 600" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" fill="none" style={lineStyle(620, '0.6s')}/>
        </svg>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center  mb-30">
          <h2 className="text-4xl font-semibold font-serif text-purple-400 sm:text-5xl inline-block px-4">
            Features
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Go beyond simple tools. Our features are designed to change how you learn, create, and discover.
          </p>
        </div>
        
        {/* Using a 2-column grid is more stable for hardcoded lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 place-items-center">
          {featuresData.map((feature, index) => {
             const IconComponent = feature.icon;
             return (
              <FeatureCard key={index} title={feature.title} icon={<IconComponent className="text-purple-400" size={24} />}>
                {feature.content}
              </FeatureCard>
             )
          })}
        </div>
      </div>
    </section>
    </div>
    
  );
};
