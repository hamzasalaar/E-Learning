import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    price: 0,
  });

  const [lectureNotes, setLectureNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLectureNotes(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("videoUrl", formData.videoUrl);
      data.append("price", formData.price);

      for (let i = 0; i < lectureNotes.length; i++) {
        data.append("lectureNotes", lectureNotes[i]);
      }

      const res = await axios.post(
        "http://localhost:3000/api/teacher/create-course",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
          },
        }
      );

      if (res.status === 201) {
        toast.success("Course added successfully!");
        setFormData({ title: "", description: "", videoUrl: "", price: 0 });
        setLectureNotes([]);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course">
      <h2>Add a New Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Video URL:
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Lecture Notes (PDF files):
          <input
            type="file"
            name="lectureNotes"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />
        </label>

        <label>
          Price ($):
          <input
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Course"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <style>{`
        .add-course {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.1);
          font-family: sans-serif;
        }

        .add-course h2 {
          color: #008080;
          margin-bottom: 20px;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 15px;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-top: 5px;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        button {
          background-color: #008080;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
        }

        button:hover {
          background-color: #006060;
        }

        .message {
          margin-top: 15px;
          font-size: 14px;
          color: #008080;
        }

        @media (max-width: 600px) {
          .add-course {
            padding: 20px;
          }

          input, textarea {
            font-size: 14px;
          }

          button {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default AddCourse;
