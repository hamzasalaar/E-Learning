import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/teacher/courses", {
        params: { page, limit: 5, search, sort, order },
        withCredentials: true,
      });

      if (res.data.success) {
        setCourses(res.data.courses);
        setTotalPages(res.data.totalPages || 1);
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

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, [page, search, sort, order]);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <main className="main-content">
          <div className="simple-bar">
            <h2>Courses</h2>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="createdAt">Latest</option>
                <option value="sales">Highest Sales</option>
                <option value="enrollments">Most Enrolled</option>
              </select>
              <select value={order} onChange={(e) => setOrder(e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <>
              <div className="course-list">
                <div className="course-header">
                  <span>Name</span>
                  <span>Status</span>
                  {/* <span>Sales</span> */}
                  <span>Enrollments</span>
                </div>

                {courses.map((course) => (
                  <Link
                    to={`/teacher/course-content/${course._id}`}
                    className="course-item"
                    key={course._id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="course-info">
                      <img
                        src={
                          course.thumbnailUrl ||
                          "https://via.placeholder.com/40"
                        }
                        alt={course.title}
                      />
                      <span className="course-title">{course.title}</span>
                    </div>
                    <span
                      style={{
                        color:
                          course.status === "approved"
                            ? "green"
                            : course.status === "pending"
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {course.status}
                    </span>
                    {/* <span>${course.sales || 0}</span> */}
                    <span>{course.studentsEnrolled?.length || 0}</span>
                  </Link>
                ))}
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .dashboard-content {
          display: flex;
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          background: #f8f9fc;
          padding: 30px;
          overflow-y: auto;
        }

        .course-list {
          margin-top: 20px;
        }

        .course-header,
        .course-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }

        .course-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .course-title {
          font-weight: 500;
        }

        input,
        select {
          padding: 5px;
          font-size: 14px;
        }

        button {
          padding: 5px 10px;
          margin: 0 5px;
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
