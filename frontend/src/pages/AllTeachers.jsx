import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AllTeachers.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AllTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/public/teachers`
        );

        // Guard against unexpected structure
        if (res.data.success && Array.isArray(res.data.teachers)) {
          setTeachers(res.data.teachers);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        console.error("Error loading teachers:", err);
        setError("An error occurred while fetching teachers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <div className="center">Loading teachers...</div>;
  if (error) return <div className="center error">{error}</div>;

  return (
    <div className="teachers-page">
      <h2 className="title">Meet Our Tutors</h2>
      <div className="teachers-grid">
        {Array.isArray(teachers) && teachers.length > 0 ? (
          teachers.map((teacher, index) => (
            <div key={teacher._id || index} className="teacher-card">
              <img
                src={
                  teacher.picture
                    ? `${API_BASE_URL}${teacher.picture}`
                    : "https://i.postimg.cc/9M3h9DGf/teacher-1.jpg"
                }
                alt={teacher.name}
                className="teacher-img"
                onError={(e) => {
                  if (
                    e.target.src !==
                    window.location.origin + "/default-profile.png"
                  ) {
                    e.target.src = "/default-profile.png";
                  }
                }}
              />
              <h4>{teacher.name}</h4>
              <p>{teacher.email}</p>
              <p className="course-count">
                {teacher.courseCount ?? 0}{" "}
                {teacher.courseCount === 1 ? "course" : "courses"}
              </p>
            </div>
          ))
        ) : (
          <p className="center">No teachers found.</p>
        )}
      </div>
    </div>
  );
}
