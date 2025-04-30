import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the student's enrolled courses
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/courses", {
          withCredentials: true,
        });
        setCourses(res.data);
        setLoading(false);
      } catch {
        setError("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-courses">
      <div className="simple-bar">
        <h2>My Courses</h2>
      </div>

      <div className="course-list">
        <div className="course-header">
          <span>Name</span>
          <span>Progress</span>
        </div>

        {courses.map((course) => (
          <Link
            to={`/student/course-content/${course.id}`} // Navigate to course content
            className="course-item"
            key={course.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="course-info">
              <img src={course.image} alt={course.title} />
              <span className="course-title">{course.title}</span>
            </div>
            <span>{course.progress}%</span>
          </Link>
        ))}
      </div>

      <style>{`
        .my-courses {
          font-family: sans-serif;
          padding: 30px;
          background: #f8f9fc;
          min-height: 100vh;
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
          grid-template-columns: 1fr 100px;
          font-weight: bold;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 2px solid #ccc;
        }

        .course-item {
          display: grid;
          grid-template-columns: 1fr 100px;
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
}