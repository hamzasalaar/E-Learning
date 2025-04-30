import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./Layouts/AdminLayout";
import StudentLayout from "./Layouts/StudentLayout";
import PublicLayout from "./Layouts/PublicLayout";
import StudentDashboard from "./components/student/Dashboard";
import Courses from "./components/student/Courses";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <div className="app-container">
        <Routes>
          {/* Public Layout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Student Layout */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<Courses />} />
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            {/* Add more admin routes here */}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
