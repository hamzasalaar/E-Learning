import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./Layouts/AdminLayout";
import UserLayout from "./Layouts/UserLayout";
import PublicLayout from "./Layouts/PublicLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <div className="app-container">
        <h1>CRM</h1>
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
