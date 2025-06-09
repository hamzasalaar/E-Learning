import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    videoUrl: "",
  });
  const [lectureNotes, setLectureNotes] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLectureNotes(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("videoUrl", formData.videoUrl);

    // Append multiple lecture notes
    for (let i = 0; i < lectureNotes.length; i++) {
      data.append("lectureNotes", lectureNotes[i]);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/teachers/create-course`, // or your full backend route
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
        }
      );

      alert("Course created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating course");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Create New Course</h2>

      <input
        type="text"
        name="title"
        placeholder="Course Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Course Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="videoUrl"
        placeholder="Video URL (for now)"
        value={formData.videoUrl}
        onChange={handleChange}
      />

      <input
        type="file"
        name="lectureNotes"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />

      <button type="submit">Create Course</button>
    </form>
  );
};

export default CreateCourse;
