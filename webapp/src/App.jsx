import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user/:id" element={<PublicProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
