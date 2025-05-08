import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/public/courses");
        const approvedCourses = res.data.courses.filter(c => c.status === "approved");
        setCourses(approvedCourses);
        setFilteredCourses(approvedCourses);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [search, courses]);

  return (
    <div className="teacher-courses">
      <h2>All Courses</h2>

      <input
        type="text"
        placeholder="Search courses by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          width: "100%",
          maxWidth: "400px",
          margin: "10px auto 30px",
          display: "block",
          border: "1px solid #ccc",
          borderRadius: "6px"
        }}
      />

      {loading ? (
        <p className="info">Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="info">No courses match your search.</p>
      ) : (
        <div className="course-list">
          {filteredCourses.map((course) => (
            <Link
              to={`/courses/${course._id}`}
              className="course-card"
              key={course._id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={course.imageUrl} alt={course.title} className="course-image" />
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="description">{course.description.slice(0, 100)}...</p>
                <div className="details">
                  <p><strong>Price:</strong> ${course.price.toFixed(2)}</p>
                  <p><strong>Students Enrolled:</strong> {course.studentsEnrolled?.length || 0}</p>
                  <p><strong>Rating:</strong> {course.rating}/5</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .teacher-courses {
          max-width: 1100px;
          margin: 0 auto;
          padding: 30px 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          text-align: center;
          color: #006666;
          margin-bottom: 25px;
        }

        .info, .error {
          text-align: center;
          font-size: 16px;
          color: #555;
        }

        .error {
          color: red;
        }

        .course-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .course-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.2s ease;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .course-card:hover {
          transform: translateY(-5px);
        }

        .course-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .course-content {
          padding: 15px 20px;
        }

        .course-content h3 {
          margin: 0 0 10px;
          font-size: 20px;
          color: #004d4d;
        }

        .description {
          font-size: 14px;
          color: #444;
          margin-bottom: 10px;
        }

        .details p {
          margin: 5px 0;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .course-card {
            flex-direction: column;
          }

          .course-image {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}
