// src/layouts/AdminLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import "../css/AdminLayout.css"; // Keep your existing styling

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminPanel />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
