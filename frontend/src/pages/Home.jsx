import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("all");

  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);

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

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user?.role === "student") {
        try {
          const res = await axios.get(
            "http://localhost:3000/api/student/my-courses",
            {
              withCredentials: true,
            }
          );
          const enrolledIds = res.data.coursesWithProgress?.map((c) => c._id);
          setEnrolledCourses(enrolledIds || []);
        } catch (err) {
          console.error("Failed to fetch enrolled courses", err);
          setEnrolledCourses([]);
        }
      } else {
        setEnrolledCourses([]);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

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
      console.error("Enrollment failed:", err);
      toast.error(err.response?.data?.message || "Failed to enroll in course.");
    }
  };

  // 🔍 Filter and sort logic
  const filteredCourses = courses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-text">
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
                placeholder="Search courses by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="search-button">🔍</button>
            </div>
            <h1 className="hero-title">
              Explore What Professionals Like You Are Learning The Most
            </h1>
            <Link to="/courses" className="hero-button">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="popular-courses">
        <div className="container">
          <h2 className="section-title">Popular Courses</h2>
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses
                .slice(0, 4)
                .map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    enrolledCourses={enrolledCourses}
                    handleEnroll={handleEnroll}
                  />
                ))
            ) : (
              <p>No courses found for your search.</p>
            )}
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
                  src={
                    tutor.picture
                      ? `http://localhost:3000${tutor.picture}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={tutor.name}
                  className="tutor-image"
                />
                <h4 className="tutor-name">{tutor.name}</h4>
                <p className="tutor-role">{tutor.role}</p>
                <p className="course-count">
                  {tutor.courseCount}{" "}
                  {tutor.courseCount === 1 ? "course" : "courses"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
  a.course-link {
    text-decoration: none;
    color: inherit;
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


  .enroll-button {
    margin-top: 10px;
    padding: 10px;
    text-align: center;
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

  .courses-grid {
    display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .course-card {
    display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  height: 100%; /* ensure it can stretch */
  }

  .course-card:hover {
    transform: translateY(-5px);
  }

  .course-description {
  min-height: 40px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
}


  .course-image {
    width: 100%;
  height: 180px;
  object-fit: cover;
  }

  .course-info {
    flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  }

  .rating{
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin: 10px 0;
  }

  .tutors-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .tutor-card {
    width: 160px;
    padding: 15px;
    text-align: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tutor-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }

  .tutor-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }

  .tutor-role {
    font-size: 14px;
    color: #777;
  }

  .view-course-button {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #00796b;
    color: white;
    border: none;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    cursor: pointer;
  }

  .view-course-button:hover {
    background-color: #1565c0;
  }

  /* Responsive Grid Breakpoints */
  @media (max-width: 1200px) {
    .courses-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 900px) {
    .courses-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .courses-grid {
      grid-template-columns: 1fr;
    }

    .search-container {
      flex-direction: column;
      align-items: stretch;
    }

    .sort-dropdown,
    .search-input,
    .search-button {
      width: 100%;
      font-size: 16px;
      padding: 12px;
    }

    .search-button {
      margin-top: 10px;
    }
  }
`}</style>
    </>
  );
}
