import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);

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
    let result = courses.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredCourses(result);
  }, [search, sort, courses]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      toast.error("Please register or login to enroll in a course.");
      navigate("/register");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll in courses.");
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
      toast.error(err.response?.data?.message || "Failed to enroll in course.");
    }
  };

  return (
    <div className="public-courses">
      <h2>All Courses</h2>

      <div className="search-container">
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-dropdown">
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
        <button className="search-button">
          🔍
        </button>
      </div>

      {loading ? (
        <p className="info">Loading courses...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="info">No courses match your search.</p>
      ) : (
        <div className="course-list">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card-inner">
              <img
                src={course.imageUrl || "/default-course.jpg"}
                alt={course.title}
                className="course-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-course.jpg";
                }}
              />
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description.slice(0, 100)}...</p>
                <p className="price">${course.price}</p>
                <p className="platform">By {course.teacher?.name || "Instructor"}</p>
                <div className="rating">
                  ⭐ {course.rating.toFixed(1)} ({course.reviews.length} reviews)
                </div>
                <button
                  className="enroll-button"
                  onClick={() => handleEnroll(course._id)}
                  disabled={enrolledCourses.includes(course._id)}
                >
                  {enrolledCourses.includes(course._id) ? "Enrolled" : "Enroll"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
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

        .course-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .course-card-inner {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease;
          display: flex;
          flex-direction: column;
        }

        .course-card-inner:hover {
          transform: translateY(-5px);
        }

        .course-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }

        .course-info {
          padding: 16px;
        }

        .course-info h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .course-info p {
          font-size: 14px;
          color: #555;
          margin: 4px 0;
        }

        .price {
          font-weight: bold;
          color: #00796b;
        }

        .rating {
          font-size: 13px;
          color: #ffa41c;
        }

        .enroll-button {
          margin-top: 10px;
          padding: 10px 15px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .enroll-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
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
        }
      `}</style>
    </div>
  );
}