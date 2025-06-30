import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link to="/">Home</Link>
      {!token && <Link to="/login">Login</Link>}
      {!token && <Link to="/register">Register</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}
