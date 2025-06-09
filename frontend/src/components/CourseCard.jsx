import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course, enrolledCourses, handleEnroll }) => {
  const isEnrolled = enrolledCourses.includes(course._id);

  return (
    <div className="course-card">
      <Link to={`/course-details/${course._id}`} className="course-link">
        <img
          src={
            `http://localhost:3000${course.imageUrl}` || "/default-course.jpg"
          }
          alt={course.title}
          className="course-image"
          onError={(e) => (e.target.src = "/default-course.jpg")}
        />
      </Link>
      <div className="course-info">
        <h3>{course.title}</h3>
        <p className="course-description">
          {course.description.slice(0, 100)}...
        </p>
        <p className="price">${course.price}</p>
        <p className="platform">
          Instructor: {course.teacher.name || "Instructor"}
        </p>
        <div className="rating">
          <span>Ratings: {course.rating.toFixed(1)} ⭐</span>
          <span>({course.reviews.length} reviews)</span>
        </div>
        {isEnrolled ? (
          <Link to={`/student/course-content/${course._id}`}>
            <button className="enroll-button">View Course</button>
          </Link>
        ) : (
          <button
            className="enroll-button"
            onClick={(e) => {
              e.preventDefault();
              handleEnroll(course._id);
            }}
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
