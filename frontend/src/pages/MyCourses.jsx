import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/MyCourses.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/student/my-courses",
          { withCredentials: true }
        );
        setCourses(res.data.coursesWithProgress || []);
      } catch {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort logic
  const filteredCourses = courses
    .filter((course) => {
      if (filter === "completed") return course.progress.percentage === 100;
      if (filter === "inprogress") return course.progress.percentage < 100;
      return true; // 'all'
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "progress")
        return b.progress.percentage - a.progress.percentage;
      return 0;
    });

  if (loading) return <div className="center">Loading...</div>;
  if (error) return <div className="center">{error}</div>;

  return (
    <div className="my-courses">
      <div className="heading-bar">
        <h2>My Enrolled Courses</h2>
        <p>You can resume any course you're enrolled in.</p>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title (A-Z)</option>
            <option value="progress">Progress (%)</option>
          </select>
        </div>
      </div>
      <div className="course-grid-wrapper">
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course._id} className="course-card">
                <img
                  src={`http://localhost:3000${course.imageUrl}` || "/default-course.jpg"}
                  alt={course.title}
                  className="course-img"
                />
                <div className="card-body">
                  <h3 className="title">{course.title}</h3>
                  <p className="instructor">
                    By {course.teacher?.name || "Instructor"}
                  </p>
                  <p className="desc">
                    {course.description?.slice(0, 80) || "No description"}...
                  </p>

                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${course.progress.percentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {course.progress.percentage}% complete
                    </span>
                  </div>

                  <Link
                    to={`/student/course-content/${course._id}`}
                    className="continue-btn"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
