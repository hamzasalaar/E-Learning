import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "lecture",
    url: "",
    file: null,
    dueDate: "",
    instructions: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCourseAndMaterials = async () => {
      try {
        const [courseRes, materialsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/teacher/courses/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }),
          axios.get(`http://localhost:3000/api/teacher/courses/${id}/materials`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
        ]);

        setCourse(courseRes.data.course);
        setMaterials(materialsRes.data.materials || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load course or materials.");
        toast.error("Could not load course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndMaterials();
  }, [id]);

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newMaterial.title);
      formData.append("type", newMaterial.type);

      if (newMaterial.type === "assignment") {
        formData.append("dueDate", newMaterial.dueDate);
        formData.append("instructions", newMaterial.instructions);
      }

      if (newMaterial.file) {
        formData.append("file", newMaterial.file);
      } else if (newMaterial.url) {
        formData.append("url", newMaterial.url);
      }

      let res;
      if (editMode) {
        res = await axios.put(
          `http://localhost:3000/api/teacher/courses/${id}/materials/${currentMaterialId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            onUploadProgress: (e) => {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          }
        );
        toast.success("Material updated.");
        setMaterials((prev) =>
          prev.map((mat) => (mat._id === currentMaterialId ? res.data.material : mat))
        );
      } else {
        res = await axios.post(
          `http://localhost:3000/api/teacher/courses/${id}/materials`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            onUploadProgress: (e) => {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          }
        );
        toast.success("Material added.");
        setMaterials((prev) => [...prev, res.data.material]);
      }

      setNewMaterial({
        title: "",
        type: "lecture",
        url: "",
        file: null,
        dueDate: "",
        instructions: ""
      });
      setEditMode(false);
      setCurrentMaterialId(null);
      setUploadProgress(0);
    } catch (err) {
      toast.error("Failed to submit material.");
    }
  };

  const handleEditMaterial = (material) => {
    setNewMaterial({
      title: material.title,
      type: material.type,
      url: material.url || "",
      file: null,
      dueDate: material.dueDate || "",
      instructions: material.instructions || ""
    });
    setEditMode(true);
    setCurrentMaterialId(material._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/teacher/courses/${id}/materials/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setMaterials((prev) => prev.filter((mat) => mat._id !== materialId));
      toast.success("Deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete material.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!course) return <p style={{ textAlign: "center" }}>Course not found</p>;

  return (
    <div className="teacher-course-container">
      <header className="course-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="header-content">
          <img src={course.imageUrl} alt={course.title} className="course-image" />
          <div className="header-text">
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="course-meta">
              <span className={`status-badge ${course.status}`}>{course.status}</span>
              <span>${course.price.toFixed(2)}</span>
              <span>{course.studentsEnrolled?.length || 0} students</span>
              <span>{course.rating}/5</span>
            </div>
          </div>
        </div>
      </header>

      <section className="materials-section">
        <h2>{editMode ? "Edit Material" : "Add New Material"}</h2>
        <form onSubmit={handleMaterialSubmit} className="material-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={newMaterial.type}
              onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
            >
              <option value="lecture">Lecture</option>
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          {newMaterial.type === "video" && (
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
              />
            </div>
          )}

          {newMaterial.type === "assignment" && (
            <>
              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  value={newMaterial.instructions}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, instructions: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  value={newMaterial.dueDate}
                  onChange={(e) => setNewMaterial({ ...newMaterial, dueDate: e.target.value })}
                />
              </div>
            </>
          )}

          {newMaterial.type !== "video" && (
            <div className="form-group">
              <label>Upload File</label>
              <input
                type="file"
                onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit">{editMode ? "Update" : "Add"} Material</button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setNewMaterial({
                    title: "",
                    type: "lecture",
                    url: "",
                    file: null,
                    dueDate: "",
                    instructions: ""
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {uploadProgress > 0 && (
            <p style={{ marginTop: "10px" }}>Upload: {uploadProgress}%</p>
          )}
        </form>

        <h2 style={{ marginTop: "40px" }}>Course Materials</h2>
        {materials.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No materials added yet. Use the form above to get started.
          </p>
        ) : (
          <div className="materials-grid">
            {materials.map((mat) => (
              <div key={mat._id} className="material-card">
                <h4>{mat.title}</h4>
                <p>Type: {mat.type}</p>
                {mat.dueDate && <p>Due: {new Date(mat.dueDate).toLocaleString()}</p>}
                <div className="material-actions">
                  {mat.url ? (
                    <a href={mat.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  ) : (
                    <a
                      href={`http://localhost:3000/uploads/${mat.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  )}
                  <button onClick={() => handleEditMaterial(mat)}>Edit</button>
                  <button onClick={() => handleDeleteMaterial(mat._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .teacher-course-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }
        .course-header {
          margin-bottom: 30px;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header-content {
          display: flex;
          gap: 20px;
        }
        .course-image {
          width: 200px;
          height: 130px;
          object-fit: cover;
          border-radius: 8px;
        }
        .course-meta {
          display: flex;
          gap: 10px;
          font-size: 14px;
          color: #666;
        }
        .status-badge.approved {
          background: green;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .status-badge.pending {
          background: orange;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .status-badge.rejected {
          background: red;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .materials-section {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          font-weight: 500;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
        }
        .form-actions {
          display: flex;
          gap: 10px;
        }
        .materials-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          margin-top: 20px;
        }
        .material-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
        }
        .material-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default CourseContent;
