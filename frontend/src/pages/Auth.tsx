import { useState } from "react";
import { motion } from "framer-motion";

export const SignupSlider = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* Left Slider Panel with Image Background */}
        <motion.div
          className="hidden md:flex relative flex-col items-center justify-center w-1/2 p-10 text-white"
          initial={false}
          animate={{ x: isSignUp ? 0 : "100%" }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Background image */}
          <img
            src="/bg2.png"  // replace with your image path
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          {/* Gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-700/70 to-purple-500/70"></div> */}

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? "Welcome!" : "Welcome Back!"}
            </h2>
            <p className="mb-6">
              {isSignUp
                ? "Already have an account? Sign in and continue your journey!"
                : "Don’t have an account yet? Sign up and join us!"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="px-6 py-2 rounded-lg bg-white text-purple-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Right Form Panel */}
        <motion.div
          className="flex flex-col justify-center w-full md:w-1/2 p-10"
          initial={false}
          animate={{ x: isSignUp ? 0 : "-100%" }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {isSignUp ? (
            <div>
              <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center font-serif">
                Create Account
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full text-xl font-serif bg-purple-500 hover:bg-purple-600  text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition"
                >
                  Sign Up
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center font-serif">
                Sign In
              </h2>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full text-xl font-serif bg-purple-500 hover:bg-purple-600   text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
