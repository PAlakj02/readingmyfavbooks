import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/:id" element={<PublicProfile />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
