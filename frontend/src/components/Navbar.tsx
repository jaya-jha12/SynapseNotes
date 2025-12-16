import { Link as ScrollLink, scroller } from "react-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Phone, LogIn, Rocket, Star, BookOpen,User,LogOut } from "lucide-react";
import { useCallback,useState,useEffect } from "react";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");
    
    setIsLoggedIn(!!token); // !! converts string to boolean (true if token exists)
    if (user) setUsername(user);
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/"); 
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
        navigate("/mynotes");
    } else {
        navigate("/signin");
    }
  };

  // helper for handling section navigation
  const handleNavClick = useCallback(
    (section: string) => {
      if (location.pathname === "/") {
        // already on landing page → smooth scroll
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -70,
        });
      } else {
        // go to landing page with hash param
        navigate(`/?section=${section}`);
      }
    },
    [location, navigate]
  );

  return (
    <header className="fixed top-0 left-0 z-50 flex items-center justify-between px-10 py-1 bg-white/10 backdrop-blur-md rounded-xl text-white shadow-md w-full">
      <div className="flex items-center ">
        <img src="/logo.png" alt="logo" className="pr-3 h-15 w-15" />
        <span className="text-2xl font-semibold font-serif ">Synapse Notes</span>
      </div>

      {/* Scrollable Menu Links */}
      <div className="hidden md:flex items-center space-x-8">
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center space-x-2 hover:text-purple-300 cursor-pointer"
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick("feature")}
          className="flex items-center space-x-2 hover:text-purple-300 cursor-pointer"
        >
          <Star size={18} />
          <span>Features</span>
        </button>

        <button
          onClick={() => handleNavClick("contact")}
          className="flex items-center space-x-2 hover:text-purple-300 cursor-pointer"
        >
          <Phone size={18} />
          <span>Contact Us</span>
        </button>

        {/* Only show "My Notes" if logged in (Optional, but good UX) */}
        {isLoggedIn && (
          <Link to="/mynotes" className="flex items-center space-x-2 hover:text-purple-300 cursor-pointer">
            <BookOpen size={18} />
            <span>My Notes</span>
          </Link>
        )}
      </div>

      {/* Route Navigation Buttons */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            {/* Display Username */}
            <span className="hidden md:flex items-center gap-2 text-purple-200 text-sm">
              <User size={16} />
              Hi, {username}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center border-2 border-red-400/50 space-x-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition group"
            >
              <LogOut className="text-red-400 group-hover:text-red-300" size={18} />
              <span className="text-red-400 group-hover:text-red-300">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/signin"
            className="flex items-center border-3 border-purple-300 space-x-2 px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            <LogIn className="text-purple-300" size={18} />
            <span className="text-purple-300">Sign In</span>
          </Link>
        )}

        <button
          onClick={handleGetStarted}
          className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white font-semibold shadow transition-colors"
        >
          <Rocket size={18} />
          <span>Get Started</span>
        </button>
      </div>
    </header>
  );
};
