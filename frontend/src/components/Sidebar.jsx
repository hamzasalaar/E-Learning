import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/Sidebar.css"; // Add your styles
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Links */}
      <ul>
        <li>
          <Link to="/dashboard">
            <FaUser /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <FaUser /> Profile
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
 