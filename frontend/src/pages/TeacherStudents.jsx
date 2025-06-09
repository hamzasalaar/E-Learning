import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa";
import { toast } from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const TeacherStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    // Fetch teacher's courses
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/teacher/courses`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setCourses(res.data.courses);
        } else {
          toast.error("Failed to load courses.");
        }
      } catch (err) {
        toast.error("Error loading courses.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchStudents = async (courseId) => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/teacher/courses/${courseId}/enrollments`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setStudents(res.data.enrolledStudents || []);
      } else {
        toast.error("Failed to load students.");
      }
    } catch (err) {
      toast.error("Error loading students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    if (courseId) {
      fetchStudents(courseId);
    } else {
      setStudents([]);
    }
  };

  return (
    <div className="teacher-students">
      <h2>My Students</h2>

      {loadingCourses ? (
        <p>Loading courses...</p>
      ) : (
        <div className="selector">
          <label>Select a course:</label>
          <select value={selectedCourseId} onChange={handleCourseChange}>
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingStudents ? (
        <p>Loading students...</p>
      ) : selectedCourseId && students.length === 0 ? (
        <p>No students enrolled in this course yet.</p>
      ) : (
        <div className="student-list">
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <FaUserGraduate size={30} className="icon" />
              <div className="info">
                <h4>{student.name}</h4>
                <p>{student.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .teacher-students {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          color: #008080;
          margin-bottom: 20px;
        }

        .selector {
          margin-bottom: 25px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .student-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .student-card {
          background: #f8f9fc;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }

        .icon {
          color: #008080;
        }

        .info h4 {
          margin: 0;
          font-size: 16px;
        }

        .info p {
          margin: 3px 0 0;
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default TeacherStudents;
