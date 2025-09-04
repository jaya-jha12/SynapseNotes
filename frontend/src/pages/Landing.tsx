export const Landing = () => {
  return (
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
  );
};
