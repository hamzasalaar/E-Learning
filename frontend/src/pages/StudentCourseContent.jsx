import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaDownload, FaLink, FaCheckCircle } from "react-icons/fa";
import "../css/StudentCourseContent.css";

export default function StudentCourseContent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseAndMaterials = async () => {
      try {
        const [courseRes, materialsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/student/courses/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(`http://localhost:3000/api/student/courses/${courseId}/materials`, {
            withCredentials: true,
          }),
        ]);
        setCourse(courseRes.data.course);
        setMaterials(materialsRes.data.materials);
      } catch (err) {
        console.error("Failed to fetch course content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndMaterials();
  }, [courseId]);

  if (loading) return <p className="center">Loading...</p>;
  if (!course) return <p className="center">Course not found</p>;

  return (
    <div className="student-course-content">
      <div className="course-header">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
      </div>

      <h3 className="section-heading">Course Materials</h3>
      {materials.length === 0 ? (
        <p>No materials available yet.</p>
      ) : (
        <div className="material-list">
          {materials.map((mat) => (
            <div key={mat._id} className="material-card">
              <div className="material-header">
                <h4>{mat.title}</h4>
                <span className={`badge badge-${mat.type}`}>{mat.type.toUpperCase()}</span>
              </div>
              {mat.instructions && <p className="instructions">📘 {mat.instructions}</p>}
              {mat.dueDate && (
                <p className="due-date">
                  📅 Due: {new Date(mat.dueDate).toLocaleString()}
                </p>
              )}
              <div className="material-links">
                {mat.url ? (
                  <a href={mat.url} target="_blank" rel="noreferrer">
                    <FaLink /> View Material
                  </a>
                ) : (
                  mat.filePaths?.map((fp, idx) => (
                    <a
                      key={idx}
                      href={`http://localhost:3000/${fp.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaDownload /> Download File {idx + 1}
                    </a>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}