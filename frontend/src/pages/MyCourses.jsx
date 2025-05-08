import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/my-courses", {
          withCredentials: true,
        });
        setCourses(res.data.coursesWithProgress || []);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="my-courses">
      <div className="simple-bar">
        <h2>My Courses</h2>
      </div>

      {loading ? (
        <div className="status-message">Loading your enrolled courses...</div>
      ) : error ? (
        <div className="status-message error">{error}</div>
      ) : courses.length === 0 ? (
        <div className="status-message">You are not enrolled in any courses yet.</div>
      ) : (
        <div className="course-list">
          <div className="course-header">
            <span>Course</span>
            <span>Progress</span>
          </div>

          {courses.map((course) => (
            <Link
              to={`/student/course-content/${course._id}`}
              className="course-item"
              key={course._id}
            >
              <div className="course-info">
                <img
                  src={course.imageUrl || "https://via.placeholder.com/40"}
                  alt={course.title}
                />
                <span className="course-title">{course.title}</span>
              </div>
              <span className="progress">{course.progress?.percentage || 0}%</span>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .my-courses {
          font-family: "Segoe UI", sans-serif;
          padding: 30px;
          background: #f8f9fc;
          min-height: 100vh;
        }

        .simple-bar {
          background-color: #0ab3a3;
          color: white;
          padding: 12px 25px;
          border-radius: 5px;
          margin-bottom: 25px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }

        .course-list {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .course-header,
        .course-item {
          display: grid;
          grid-template-columns: 1fr 100px;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .course-header {
          font-weight: 600;
          border-bottom: 2px solid #ccc;
        }

        .course-item:last-child {
          border-bottom: none;
        }

        .course-item {
          text-decoration: none;
          color: #333;
          transition: background 0.2s;
        }

        .course-item:hover {
          background-color: #f0f0f0;
        }

        .course-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .course-title {
          font-weight: 500;
        }

        .course-info img {
          width: 45px;
          height: 45px;
          object-fit: cover;
          border-radius: 6px;
        }

        .progress {
          font-weight: bold;
          color: #008080;
        }

        .status-message {
          text-align: center;
          font-size: 16px;
          color: #555;
          margin-top: 40px;
        }

        .status-message.error {
          color: red;
        }

        @media (max-width: 768px) {
          .course-header,
          .course-item {
            grid-template-columns: 1fr;
            text-align: left;
            row-gap: 5px;
          }

          .progress {
            margin-top: 5px;
          }
        }
      `}</style>
    </div>
  );
}
