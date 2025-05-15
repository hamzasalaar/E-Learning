import React from "react";

const CourseHeader = ({ course, onEditClick }) => {
  if (!course) return null;

  return (
    <header className="course-header">
      <button onClick={() => window.history.back()} className="back-button">
        ← Back
      </button>
      <div className="header-content">
        <img
          src={`http://localhost:3000${course.imageUrl}`}
          alt={course.title}
          className="course-image"
        />
        <div className="header-text">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-meta">
            <span className={`status-badge ${course.status}`}>
              {course.status}
            </span>
            <span>${course.price.toFixed(2)}</span>
            <span>{course.studentsEnrolled?.length || 0} students</span>
            <span>{course.rating}/5</span>
          </div>
          <button className="edit-course-btn" onClick={onEditClick}>
            ✏️ Update Course Info
          </button>
        </div>
      </div>
    </header>
  );
};

export default CourseHeader;
