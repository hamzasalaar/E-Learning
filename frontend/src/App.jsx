import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./Layouts/AdminLayout";
import TeacherLayout from "./Layouts/TeacherLayout";
import PublicLayout from "./Layouts/PublicLayout";
import "./css/Index.css";
import TeacherDashboard from "./pages/Dashboard";
import AddCourse from "./pages/AddCourse";
import CourseContent from "./pages/CourseContent"; 
import StudentLayout from "./Layouts/StudentLayout";
import MyCourses from "./pages/MyCourses";
import Profile from "./pages/StudentProfile"; 

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
        </Route>

        {/* Teacher Layout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="addcourse" element={<AddCourse />} />
          <Route path="course-content/:id" element={<CourseContent />} />
        </Route>

         {/* Student Layout */}
       <Route path="/student" element={<StudentLayout />}>
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}
