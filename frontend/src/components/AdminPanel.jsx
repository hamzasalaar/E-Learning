// src/components/AdminPanel.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Logout } from "../redux/AuthSlice";

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", {}, {
        withCredentials: true,
      });
      if (res.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/courses">Manage Courses</Link>
        </nav>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default AdminPanel;
