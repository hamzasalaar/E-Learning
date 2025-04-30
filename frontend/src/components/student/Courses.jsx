// components/student/Courses.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/student/my-courses",
          {
            withCredentials: true,
          }
        );
        setCourses(response.data.coursesWithProgress);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Enrolled Courses</h2>
      {courses && courses.length > 0 ? (
        courses.map((course) => (
          <div key={course._id}>
            <h3>{course.title}</h3>
            <p>Progress: {course.progress?.percentage || 0}%</p>
          </div>
        ))
      ) : (
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
};

export default Courses;
