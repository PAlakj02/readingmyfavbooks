import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative px-3 py-2 rounded-lg font-medium transition-all duration-200 
        hover:bg-white/10 hover:text-white group
        ${isActiveLink(to) 
          ? 'text-blue-400 bg-blue-400/10' 
          : 'text-gray-300 hover:text-white'
        }
      `}
    >
      {children}
      {isActiveLink(to) && (
        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></span>
      )}
    </Link>
  );

  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium 
                 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200
                 border border-red-500/20 hover:border-red-500/40"
    >
      Logout
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white font-bold text-xl hover:text-blue-400 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm"></span>
            </div>
            <span>Read-Watch Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            
            {!token ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/feed">Feed</NavLink>
                <div className="ml-4">
                  <LogoutButton />
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
       <div className={`md:hidden transition-all duration-300 ease-in-out ${
         isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>

          <div className="py-4 space-y-2 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </NavLink>
              
              {!token ? (
                <>
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </NavLink>
                  <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/feed" onClick={() => setIsMobileMenuOpen(false)}>
                    Feed
                  </NavLink>
                  <div className="pt-2">
                    <LogoutButton />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}