import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/public/courses");
        const approvedCourses = res.data.courses.filter(
          (c) => c.status === "approved"
        );
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

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolled = async () => {
      if (user?.role === "student") {
        try {
          const res = await axios.get(
            "http://localhost:3000/api/student/my-courses",
            {
              withCredentials: true,
            }
          );
          const enrolledIds = res.data.coursesWithProgress.map((c) => c._id);
          setEnrolledCourses(enrolledIds);
        } catch (err) {
          console.error("Failed to fetch enrolled courses", err);
        }
      } else {
        setEnrolledCourses([]);
      }
    };

    fetchEnrolled();
  }, [user]);

  // Handle search/sort
  useEffect(() => {
    let result = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [search, sort, courses]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      toast.error("Please login to enroll.");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:3000/api/student/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setEnrolledCourses((prev) => [...prev, courseId]);
        toast.success("Enrolled successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Enrollment failed.");
    }
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  return (
    <div className="public-courses">
      <h2>All Courses</h2>

      <div className="search-container">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-dropdown"
        >
          <option value="all">All</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
        <input
          type="text"
          placeholder="Search courses by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="search-button">🔍</button>
      </div>

      {loading ? (
        <p className="info">Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="info">No courses match your search.</p>
      ) : (
        <div className="course-list">
          {currentCourses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course._id);
            return (
              <div
                className="course-card"
                key={course._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={
                    `http://localhost:3000${course.imageUrl}` ||
                    "/default-course.jpg"
                  }
                  alt={course.title}
                  className="course-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-course.jpg";
                  }}
                />
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="description">
                    {course.description.slice(0, 100)}...
                  </p>
                  <div className="details">
                    <p>
                      <strong>Price:</strong> ${course.price.toFixed(2)}
                    </p>
                    <p>
                      <strong>Students Enrolled:</strong>{" "}
                      {course.studentsEnrolled?.length || 0}
                    </p>
                    <p>
                      <strong>Rating:</strong> {course.rating}/5 ⭐
                    </p>
                  </div>
                  {user?.role === "student" && isEnrolled ? (
                    <Link
                      to={`/student/course-content/${course._id}`}
                      className="view-course-button"
                    >
                      View Course
                    </Link>
                  ) : (
                    <button
                      className="enroll-button"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredCourses.length / coursesPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      <style>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          gap: 10px;
        }

        .pagination button {
          background-color: #f0f0f0;
          border: none;
          padding: 8px 14px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .pagination button:hover {
          background-color: #ddd;
        }

        .pagination button.active {
          background-color: #00796b;
          color: white;
        }

        .public-courses {
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

        .search-container {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto 30px auto;
          border: 2px solid #f90;
          border-radius: 8px;
          overflow: hidden;
        }

        .sort-dropdown {
          padding: 10px;
          border: none;
          background-color: #f2f2f2;
          font-size: 14px;
        }

        .search-input {
          flex: 1;
          padding: 10px;
          border: none;
          outline: none;
          font-size: 15px;
        }

        .search-button {
          background-color: #febd69;
          border: none;
          padding: 10px 16px;
          cursor: pointer;
          font-size: 16px;
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

        .enroll-button,
        .view-course-button {
          margin-top: 10px;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          text-decoration: none;
          background-color: #00796b;
          color: white;
        }
          .enroll-button:hover,
          .view-course-button:hover {
          background-color:rgb(103, 173, 164);
          }

        @media (max-width: 768px) {
          .search-container {
            flex-direction: column;
            align-items: stretch;
          }

          .sort-dropdown,
          .search-input,
          .search-button {
            width: 100%;
            box-sizing: border-box;
          }

          .search-input {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
          }
        }
      `}</style>
    </div>
  );
}
