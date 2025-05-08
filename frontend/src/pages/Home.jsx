import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Track enrolled courses

  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user); // Get user from Redux store

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/public/home"
        );
        setCourses(data.courses);
        setTutors(data.tutors);
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };

    fetchHomeData();
  }, []);

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
        setEnrolledCourses((prev) => [...prev, courseId]); // Add course to enrolled list
        toast.success("Enrolled successfully!");
      }
    } catch (err) {
      console.error("Failed to enroll:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to enroll in course.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for courses"
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
            <h1 className="hero-title">
              Explore What Professionals Like You Are Learning The Most
            </h1>
            <Link to="/courses" className="hero-button">
              Visit Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <h2 className="section-title">Popular Courses</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <img
                  src="/default-course.jpg"
                  alt={course.title}
                  className="course-image"
                />
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description.slice(0, 100)}...</p>
                  <p className="price">${course.price}</p>
                  <p className="platform">
                    By {course.teacher?.name || "Instructor"}
                  </p>
                  <div className="rating">
                    ⭐ {course.rating.toFixed(1)} ({course.reviews.length}{" "}
                    reviews)
                  </div>
                  {/* Enroll Button */}
                  <button
                    className="enroll-button"
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrolledCourses.includes(course._id)} // Disable if already enrolled
                  >
                    {enrolledCourses.includes(course._id)
                      ? "Enrolled"
                      : "Enroll"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Section */}
      <section className="instructed-courses">
        <div className="container">
          <h2 className="section-title">Meet Our Popular Tutors</h2>
          <div className="tutors-grid">
            {tutors.map((tutor) => (
              <div key={tutor._id} className="tutor-card">
                <img
                  src="https://i.postimg.cc/0j4wWcY2/teacher-1.jpg"
                  alt={tutor.name}
                  className="tutor-image"
                />
                <h4 className="tutor-name">{tutor.name}</h4>
                <p className="tutor-role">{tutor.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
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
      `}</style>
    </>
  );
}
