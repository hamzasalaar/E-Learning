// src/layouts/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import "../css/AdminLayout.css"; // Keep your existing styling
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logout } from "../redux/AuthSlice"; // Adjust the import path as necessary

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <h2>Admin Panel</h2>
          <nav>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/courses">Manage Courses</Link>
          </nav>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
