import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Admin.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Admin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
          withCredentials: true,
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h2>Dashboard Stats</h2>
      <div className="stats-grid">
        <div>Total Users: {stats.totalUsers}</div>
        <div>Active Users: {stats.activeUsers}</div>
        <div>Inactive Users: {stats.inactiveUsers}</div>
        <div>Students: {stats.totalStudents}</div>
        <div>Teachers: {stats.totalTeachers}</div>
        <div>Total Courses: {stats.totalCourses}</div>
        <div>Approved Courses: {stats.approvedCourses}</div>
        <div>Pending Courses: {stats.pendingCourses}</div>
        <div>Rejected Courses: {stats.rejectedCourses}</div>
        <div>Total Enrollments: {stats.totalEnrollments}</div>
      </div>

      <h3>Top Teachers</h3>
      <ul>
        {stats.topTeachers.map((teacher) => (
          <li key={teacher.email}>
            {teacher.name} ({teacher.email}) - {teacher.totalCourses} courses
          </li>
        ))}
      </ul>
    </div>
  );
}
