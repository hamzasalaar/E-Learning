import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // <-- import Link
import TeacherSidebar from "../components/TeacherSideBar";
import TeacherHeader from "../components/TeacherHeader";
import courseImage1 from "../assets/images/course-1.jpg";
import courseImage2 from "../assets/images/course-2.jpg";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);

  const handleLogout = () => {
    alert("Logging out...");
    // TODO: Implement actual logout logic
  };

  useEffect(() => {
    // TODO: Replace with actual API/database call
    setCourses([
      { id: 1, title: "Programming 101", sales: 0, enrollments: 0, image: courseImage1 },
      { id: 2, title: "Visual Programming", sales: 0, enrollments: 0, image: courseImage2 },
    ]);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <TeacherSidebar onLogout={handleLogout} />
        <main className="main-content">
          <div className="simple-bar">
            <h2>Courses</h2>
          </div>

          <div className="course-list">
            <div className="course-header">
              <span>Name</span>
              <span>Sales</span>
              <span>Enrollments</span>
            </div>

            {courses.map((course) => (
              <Link
                to={`/teacher/course-content/${course.id}`} // <-- navigate to course content
                className="course-item"
                key={course.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="course-info">
                  <img src={course.image} alt={course.title} />
                  <span className="course-title">{course.title}</span>
                </div>
                <span>${course.sales}</span>
                <span>{course.enrollments}</span>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          height: 100vh;
        }

        .dashboard-content {
          display: flex;
          flex-direction: row;
          flex-grow: 1;
        }

        .main-content {
          flex-grow: 1;
          background: #f8f9fc;
          padding: 30px;
          overflow-y: auto;
        }

        .simple-bar {
          background-color: #0ab3a3;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          margin-bottom: 20px;
          text-align: center;
        }

        .course-list {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .course-header {
          display: grid;
          grid-template-columns: 1fr 60px 100px;
          font-weight: bold;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 2px solid #ccc;
        }

        .course-item {
          display: grid;
          grid-template-columns: 1fr 60px 100px;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .course-item:last-child {
          border-bottom: none;
        }

        .course-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .course-title {
          font-weight: 500;
        }

        .course-info img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 5px;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .dashboard-content {
            flex-direction: column;
          }

          .main-content {
            padding: 20px;
          }

          .course-header,
          .course-item {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .course-item span {
            margin-top: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;