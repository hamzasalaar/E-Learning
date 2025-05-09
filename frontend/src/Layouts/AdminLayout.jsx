// src/layouts/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import "../css/AdminLayout.css"; // Keep your existing styling

const AdminLayout = () => {
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
