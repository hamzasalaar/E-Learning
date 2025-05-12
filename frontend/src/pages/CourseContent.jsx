import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MaterialCard, CourseContentStyles } from "../components/MaterialCard";
import "../css/CourseContent.css"; // Assuming you have a CSS file for styles

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCourseEdit, setShowCourseEdit] = useState(false);
  const [courseUpdate, setCourseUpdate] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "lecture",
    url: "",
    file: [],
    dueDate: "",
    instructions: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [materialId, setmaterialId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCourseAndMaterials = async () => {
      try {
        const [courseRes, materialsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/teacher/courses/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(
            `http://localhost:3000/api/teacher/courses/${courseId}/materials`,
            {
              withCredentials: true,
            }
          ),
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
  }, [courseId]);

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

      if (newMaterial.url) {
        formData.append("url", newMaterial.url);
      }

      newMaterial.file.forEach((file) => {
        formData.append("files", file);
      });

      let res;
      if (editMode) {
        res = await axios.put(
          `http://localhost:3000/api/teacher/courses/${courseId}/materials/${materialId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
            onUploadProgress: (e) => {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            },
          }
        );
        toast.success("Material updated.");
        console.log(res.data.material);
        setMaterials((prev) =>
          prev.map((mat) => (mat._id === materialId ? res.data.material : mat))
        );
      } else {
        res = await axios.post(
          `http://localhost:3000/api/teacher/courses/add-material/${courseId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
            onUploadProgress: (e) => {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            },
          }
        );
        toast.success("Material added.");
        setMaterials((prev) => [...prev, res.data.material]);
      }

      setNewMaterial({
        title: "",
        type: "lecture",
        url: "",
        file: [],
        dueDate: "",
        instructions: "",
      });
      setEditMode(false);
      setmaterialId(null);
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
      file: [],
      dueDate: material.dueDate || "",
      instructions: material.instructions || "",
    });
    setEditMode(true);
    setmaterialId(material._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/teacher/courses/${courseId}/materials/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setMaterials((prev) => prev.filter((mat) => mat._id !== materialId));
      toast.success("Deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete material.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewMaterial((prev) => ({
      ...prev,
      file: [...prev.file, ...selectedFiles],
    }));
  };

  const handleRemoveFile = (indexToRemove) => {
    setNewMaterial((prev) => ({
      ...prev,
      file: prev.file.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleCourseUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (courseUpdate.title?.trim())
      formData.append("title", courseUpdate.title);
    if (courseUpdate.description?.trim())
      formData.append("description", courseUpdate.description);
    if (courseUpdate.videoUrl?.trim())
      formData.append("videoUrl", courseUpdate.videoUrl);
    if (courseUpdate.price) formData.append("price", courseUpdate.price);
    if (courseUpdate.image) formData.append("image", courseUpdate.image);

    try {
      const res = await axios.put(
        `http://localhost:3000/api/teacher/update-course/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Course updated!");
      setCourse(res.data.course);
      setShowCourseEdit(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!course) return <p style={{ textAlign: "center" }}>Course not found</p>;

  return (
    <div className="teacher-course-container">
      <header className="course-header">
        <button onClick={() => navigate(-1)} className="back-button">
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
            <button
              className="edit-course-btn"
              onClick={() => {
                setCourseUpdate({
                  title: course.title,
                  description: course.description,
                  price: course.price,
                  imageUrl: course.imageUrl,
                  videoUrl: course.videoUrl,
                  image: null, // optional for file input
                });
                setShowCourseEdit(true);
              }}
            >
              ✏️ Update Course Info
            </button>
          </div>
        </div>
      </header>
      {showCourseEdit && (
        <form
          onSubmit={handleCourseUpdate}
          className="update-course-form"
          style={{
            marginTop: "20px",
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Edit Course Info</h3>
          <input
            type="text"
            placeholder="Title"
            value={courseUpdate.title}
            onChange={(e) =>
              setCourseUpdate({ ...courseUpdate, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={courseUpdate.description}
            onChange={(e) =>
              setCourseUpdate({ ...courseUpdate, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={courseUpdate.price}
            onChange={(e) =>
              setCourseUpdate({ ...courseUpdate, price: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCourseUpdate({ ...courseUpdate, image: e.target.files[0] })
            }
          />
          <input
            type="url"
            placeholder="Video URL"
            value={courseUpdate.videoUrl}
            onChange={(e) =>
              setCourseUpdate({ ...courseUpdate, videoUrl: e.target.value })
            }
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setShowCourseEdit(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="materials-section">
        <h2>{editMode ? "Edit Material" : "Add New Material"}</h2>
        <form onSubmit={handleMaterialSubmit} className="material-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newMaterial.title}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={newMaterial.type}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, type: e.target.value })
              }
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
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, url: e.target.value })
                }
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
                    setNewMaterial({
                      ...newMaterial,
                      instructions: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  value={newMaterial.dueDate}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, dueDate: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {newMaterial.type !== "video" && (
            <div className="form-group">
              <label>Upload File</label>
              <input
                type="file"
                name="files"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                multiple
                onChange={handleFileChange}
              />
            </div>
          )}
          {newMaterial.file.length > 0 && (
            <ul className="file-preview-list">
              {newMaterial.file.map((file, index) => (
                <li key={index} className="file-preview-item">
                  📄 {file.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="remove-file-btn"
                  >
                    ✖
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="form-actions">
            <button type="submit">
              {editMode ? "Update" : "Add"} Material
            </button>
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setNewMaterial({
                    title: "",
                    type: "lecture",
                    url: "",
                    file: [],
                    dueDate: "",
                    instructions: "",
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
              <MaterialCard
                key={mat._id}
                mat={mat}
                onEdit={handleEditMaterial}
                onDelete={handleDeleteMaterial}
              />
            ))}
          </div>
        )}
      </section>
      <section className="reviews-section">
        <h2>Course Reviews</h2>
        {course.reviews?.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No reviews yet.</p>
        ) : (
          <div className="reviews-list">
            {course.reviews.map((review) => (
              <div key={review._id} className="review-card">
                <p>
                  <strong>{review.user?.name || "Anonymous"}:</strong>{" "}
                  <span>⭐ {review.rating}</span>
                </p>
                <p>{review.comment}</p>
                <small>
                  {new Date(review.createdAt).toLocaleString()} |{" "}
                  {review.user?.email}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{CourseContentStyles}</style>
    </div>
  );
};

export default CourseContent;
