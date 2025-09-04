import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { Home, Info, Phone, LogIn, Rocket } from "lucide-react";


export const Navbar=()=>{
    return (
        <nav className="fixed top-0 left-0 z-50 flex items-center justify-between px-10 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white shadow-md w-full">
            <div className="flex  items-center ">
                <img src='./logo.png' alt='logo' className="pr-3 h-15 w-15"/>
                <span className="text-2xl font-semibold font-serif ">Synapse Notes</span>
            </div>
            {/* Scrollable Menu Links */}
            <div className="hidden md:flex items-center space-x-8">
                <ScrollLink to="home" smooth={true} duration={500} offset={-70} className="flex items-center space-x-2 hover:text-pink-300 cursor-pointer">
                    <Home size={18} />
                    <span>Home</span>
                </ScrollLink>

                <ScrollLink
                to="about"
                smooth={true}
                duration={500}
                offset={-70}
                className="flex items-center space-x-2 hover:text-pink-300 cursor-pointer"
                >
                <Info size={18} />
                <span>About Us</span>
                </ScrollLink>

                <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                offset={-70}
                className="flex items-center space-x-2 hover:text-pink-300 cursor-pointer"
                >
                <Phone size={18} />
                <span>Contact Us</span>
                </ScrollLink>
            </div>

            {/* Route Navigation Buttons */}
            <div className="flex items-center space-x-4">
                <Link
                to="/signin"
                className="flex items-center border-3 border-purple-300 space-x-2 px-4 py-2 rounded-lg hover:bg-white/20 transition"
                >
                <LogIn className="text-purple-300" size={18} />
                <span className="text-purple-300">Sign In</span>
                </Link>

                <Link
                to="/get-started"
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-semibold shadow"
                >
                <Rocket size={18} />
                <span>Get Started</span>
                </Link>
            </div>
        </nav>
    )
}