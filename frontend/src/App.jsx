import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import { Toaster } from "react-hot-toast";
import AdminLayout from "./Layouts/AdminLayout";
import TeacherLayout from "./Layouts/TeacherLayout";
import PublicLayout from "./Layouts/PublicLayout";
import "./css/Index.css";
import TeacherDashboard from "./pages/TeacherDashboard";
import AddCourse from "./pages/AddCourse";
import CourseContent from "./pages/CourseContent";
import StudentLayout from "./Layouts/StudentLayout";
import MyCourses from "./pages/MyCourses";
import StudentProfile from "./pages/StudentProfile";
import CourseDetails from "./pages/CourseDetails";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherNotifications from "./pages/TeacherNotifications";
import TeacherStudents from "./pages/TeacherStudents";
import PublicCourses from "./pages/PublicCourses";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Tutors from "./pages/Tutors";

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
          <Route path="/PublicCourse" element={<PublicCourses />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Tutors" element={<Tutors />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>

        {/* Teacher Layout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="addcourse" element={<AddCourse />} />
          <Route path="course-details" element={<CourseDetails />} />
          <Route path="TeacherCourses" element={<TeacherCourses />} />
          <Route path="courses/:id" element={<CourseContent />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="Notifications" element={<TeacherNotifications />} />
          <Route path="students" element={<TeacherStudents />} />
        </Route>

        {/* Student Layout */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
