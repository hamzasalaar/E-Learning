import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Admin.css"; // Make sure this is the path to your new CSS file

export default function Admin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/stats", {
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

  const userRoleData = [
    { name: "Students", value: stats.totalStudents },
    { name: "Teachers", value: stats.totalTeachers },
    { name: "Admins", value: stats.totalAdmins },
  ];

  const courseStatusData = [
    { name: "Approved", value: stats.totalApprovedCourses },
    { name: "Pending", value: stats.totalPendingCourses },
    { name: "Rejected", value: stats.totalRejectedCourses },
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard Stats</h2>
      <div className="stats-grid">
        <div>Total Users: {stats.totalUsers}</div>
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
