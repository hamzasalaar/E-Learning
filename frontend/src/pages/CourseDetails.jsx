import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/CourseDetails.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/public/courses/${courseId}`
        );
        setCourse(res.data.course);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="course-details-container">
      <div className="course-header">
        <img
          src={`http://localhost:3000${course.imageUrl}`}
          alt={course.title}
          className="course-banner"
          onError={(e) => (e.target.src = "/default-course.jpg")}
        />
        <div className="course-meta">
          <h1>{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <p>
            <strong>Instructor:</strong> {course.teacher?.name || "Unknown"}
          </p>
          <p>
            <strong>Enrolled Students:</strong>{" "}
            {course.studentsEnrolled?.length || 0}
          </p>
          <p>
            <strong>Price:</strong> ${course.price}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {course.rating.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {course.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="review-list">
            {course.reviews.map((review, index) => (
              <div key={index} className="review-card">
                <p>
                  <strong>Student: {review.student || "Anonymous"}</strong>
                </p>
                <p>
                  <b>Rating:</b> {review.rating} ⭐
                </p>
                <p>
                  <b>Comment:</b> {""}
                  {review.comment || <i>No comments given!</i>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
