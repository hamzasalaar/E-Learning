import React, { useEffect, useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teacher/courses`, {
          params: { limit: 1000 }, // large limit to fetch all
          withCredentials: true,
        });

        if (res.data.success) {
          setCourses(res.data.courses);
        } else {
          setError("Failed to load courses.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalCourses = courses.length;
  const approved = courses.filter(c => c.status === "approved").length;
  const pending = courses.filter(c => c.status === "pending").length;
  const rejected = courses.filter(c => c.status === "rejected").length;
  const totalStudents = courses.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, Teacher 👋</h1>
        <p>Here’s a quick summary of your course activity:</p>
      </div>

      {loading ? (
        <p className="loading">Loading dashboard...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p>{totalCourses}</p>
          </div>
          <div className="stat-card approved">
            <h3>Approved</h3>
            <p>{approved}</p>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected</h3>
            <p>{rejected}</p>
          </div>
          <div className="stat-card students">
            <h3>Total Enrollments</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
      )}

      <style>{`
        .dashboard {
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f8f9fc;
          min-height: 100vh;
        }

        .dashboard-header h1 {
          margin-bottom: 5px;
          font-size: 28px;
          color: #2c3e50;
        }

        .dashboard-header p {
          color: #555;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .loading {
          font-size: 16px;
          color: #333;
        }

        .error {
          color: red;
          font-weight: bold;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          text-align: center;
        }

        .stat-card h3 {
          margin-bottom: 10px;
          font-size: 18px;
          color: #333;
        }

        .stat-card p {
          font-size: 28px;
          font-weight: bold;
          color: #008080;
          margin: 0;
        }

        .stat-card.approved p {
          color: #27ae60;
        }

        .stat-card.pending p {
          color: #f39c12;
        }

        .stat-card.rejected p {
          color: #e74c3c;
        }

        .stat-card.students p {
          color: #2980b9;
        }

        @media (max-width: 600px) {
          .dashboard-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
