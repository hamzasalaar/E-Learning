import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; // Adjust as needed

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/teacher/courses`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <div className="teacher-courses">
      <h2>My Courses</h2>

      {loading ? (
        <p className="info">Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : courses.length === 0 ? (
        <p className="info">You have not added any courses yet.</p>
      ) : (
        <div className="course-list">
          {currentCourses.map((course) => (
            <Link
              to={`/teacher/courses/${course._id}`}
              className="course-card"
              key={course._id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={`${API_BASE_URL}${course.imageUrl}`}
                alt={course.title}
                className="course-image"
              />

              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="description">
                  {course.description.slice(0, 100)}...
                </p>

                <div className="details">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${course.status}`}>
                      {course.status}
                    </span>
                  </p>
                  <p>
                    <strong>Price:</strong> ${course.price.toFixed(2)}
                  </p>
                  <p>
                    <strong>Students Enrolled:</strong>{" "}
                    {course.studentsEnrolled?.length || 0}
                  </p>
                  <p>
                    <strong>Rating:</strong> {course.rating}/5
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                  {course.status === "rejected" && (
                    <p className="rejection">
                      <strong>Reason:</strong> {course.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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

        .status {
          font-weight: bold;
          text-transform: capitalize;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .status.approved {
          color: green;
        }

        .status.pending {
          color: orange;
        }

        .status.rejected {
          color: red;
        }

        .rejection {
          margin-top: 10px;
          color: red;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .course-card {
            flex-direction: column;
          }

          .course-image {
            height: 150px;
          }
        }
          .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.pagination button {
  background-color: #0066ff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #0050cc;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

      `}</style>
    </div>
  );
};

export default TeacherCourses;
