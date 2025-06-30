import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <ul className="flex flex-col items-center gap-4 text-2xl">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          {!token && (
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
          )}
          {!token && (
            <li>
              <Link to="/register" className="hover:underline">Register</Link>
            </li>
          )}
          {token && (
            <li>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-300"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
