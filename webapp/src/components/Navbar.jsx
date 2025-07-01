import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { LogOut, Search, Home, LayoutDashboard, Users } from "lucide-react";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  // Memoize active path for better performance
  const activePath = useMemo(() => location.pathname, [location.pathname]);

  const isActiveLink = (path) => {
    if (path === "/" && activePath === "/") return true;
    if (path !== "/" && activePath.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className={`
        group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium 
        transition-all duration-200 hover:bg-white/10 hover:text-white 
        focus:outline-none focus:ring-2 focus:ring-blue-500 mx-3
        ${
          isActiveLink(to)
            ? "text-blue-400 bg-blue-400/10 font-semibold"
            : "text-gray-400 hover:text-white"
        }
      `}
      aria-current={isActiveLink(to) ? "page" : undefined}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
      {isActiveLink(to) && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 rounded-full mx-3" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            to={token ? "/dashboard" : "/"}
            className="flex items-center space-x-3 text-white font-bold text-xl hover:text-blue-400 
                      transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">Read Watch Tracker</span>
            </div>
            <span className="hidden sm:inline">Read-Watch Tracker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-6">
            {token ? (
              <>
                <div className="flex items-center space-x-4">
                  <NavLink to="/dashboard" icon={LayoutDashboard}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/feed" icon={Search}>
                    Discover
                  </NavLink>
                  <NavLink to="/users" icon={Users}>
                    People
                  </NavLink>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg 
                            font-medium hover:bg-red-500/20 hover:text-red-300 transition-all duration-200
                            border border-red-500/20 hover:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <NavLink to="/" icon={Home}>
                  Home
                </NavLink>
                <NavLink to="/login">
                  Login
                </NavLink>
                <NavLink to="/register">
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}