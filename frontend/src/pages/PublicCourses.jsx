import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import CourseCard from "../components/CourseCard";

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
              <CourseCard
                key={course._id}
                course={course}
                enrolledCourses={enrolledCourses}
                handleEnroll={handleEnroll}
              />
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
  max-width: 600px;
  margin: 0 auto 30px auto;
  border-radius: 50px;
  background-color: #fff;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #ddd;
  transition: box-shadow 0.3s ease;
}

.search-container:focus-within {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 50px;
  background-color: transparent;
  color: #333;
}

.sort-dropdown {
  margin-left: 12px;
  border: none;
  background-color: #f4f4f4;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
}

.search-button {
  background-color: #00796b;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 12px;
  font-size: 16px;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #005f56;
}


        .info, .error {
          text-align: center;
          font-size: 16px;
          color: #555;
        }

        .error {
          color: red;
        }

        a.course-link {
    text-decoration: none;
    color: inherit;
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
          text-decoration: none;
          color: inherit;
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
          text-decoration: none;
          color: inherit;
        }

        .details p {
          margin: 5px 0;
          font-size: 14px;
          text-decoration: none;
          color: inherit;
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

          .search-input {
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
          }
        }
      `}</style>
    </div>
  );
}
