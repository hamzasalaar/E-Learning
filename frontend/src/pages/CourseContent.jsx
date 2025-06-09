import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import MaterialForm from "../components/MaterialForm";
import { MaterialCard, CourseContentStyles } from "../components/MaterialCard";
import "../css/CourseContent.css"; // Assuming you have a CSS file for styles
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
  const [liveSessions, setLiveSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: 60,
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "lecture",
    url: "",
    file: [],
    dueDate: "",
    instructions: "",
  });

  const [showMaterials, setShowMaterials] = useState(true);
  const [showSessions, setShowSessions] = useState(true);
  const [showReviews, setShowReviews] = useState(true);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [materialId, setMaterialId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sessionRecordings, setSessionRecordings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  useEffect(() => {
    const fetchCourseAndMaterials = async () => {
      try {
        const [courseRes, materialsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/teacher/courses/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(
            `${API_BASE_URL}/api/teacher/courses/${courseId}/materials`,
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
          `${API_BASE_URL}/api/teacher/courses/${courseId}/materials/${materialId}`,
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
          `${API_BASE_URL}/api/teacher/courses/add-material/${courseId}`,
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
      setMaterialId(null);
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
    setMaterialId(material._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/teacher/courses/${courseId}/materials/${materialId}`,
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
        `${API_BASE_URL}/api/teacher/update-course/${courseId}`,
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

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/teacher/course/${courseId}/sessions`,
          {
            withCredentials: true,
          }
        );
        setLiveSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Error loading sessions", err);
      }
    };

    fetchLiveSessions();
  }, [courseId]);

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/teacher/session/${sessionId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Session deleted successfully.");
      setLiveSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (err) {
      console.error("Failed to delete session", err);
      toast.error("Could not delete session.");
    }
  };

  const handleSessionClick = async (meetingID) => {
    if (selectedMeetingId === meetingID) {
      // collapse if already selected
      setSelectedMeetingId(null);
      setSessionRecordings([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/teacher/recordings/${meetingID}`,
        {
          withCredentials: true,
        }
      );
      setSessionRecordings(res.data.recordings || []);
      setSelectedMeetingId(meetingID);
    } catch (err) {
      console.error("Failed to fetch session recordings:", err);
      toast.error("Could not load recordings for this session.");
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
            src={`${API_BASE_URL}${course.imageUrl}`}
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
        <form onSubmit={handleCourseUpdate} className="update-course-form">
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

      <section className="materials-section collapsible-section">
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => setShowMaterials((prev) => !prev)}
        >
          Course Content{" "}
          {showMaterials ? <FaChevronDown /> : <FaChevronRight />}
        </h2>

        {showMaterials && (
          <>
            {/* Add New Material Button & Form */}
            <button className="add-material-btn" onClick={() => setShowMaterialForm((prev) => !prev)}>
              {showMaterialForm ? "Hide" : "Add New Material"}
            </button>

            {showMaterialForm && (
              <MaterialForm
                mode="add"
                newMaterial={newMaterial}
                setNewMaterial={setNewMaterial}
                handleSubmit={handleMaterialSubmit}
                handleRemoveFile={handleRemoveFile}
                handleFileChange={handleFileChange}
                uploadProgress={uploadProgress}
              />
            )}

            {/* Materials List */}
            {materials.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                No materials added yet. Use the form above to get started.
              </p>
            ) : (
              <div className="materials-grid">
                {materials.map((mat) => (
                  <div key={mat._id}>
                    <MaterialCard
                      mat={mat}
                      onEdit={() => handleEditMaterial(mat)}
                      onDelete={handleDeleteMaterial}
                    />

                    {/* Inline Edit Form under the material */}
                    {editMode && materialId === mat._id && (
                      <MaterialForm
                        mode="edit"
                        newMaterial={newMaterial}
                        setNewMaterial={setNewMaterial}
                        handleSubmit={handleMaterialSubmit}
                        handleRemoveFile={handleRemoveFile}
                        handleFileChange={handleFileChange}
                        uploadProgress={uploadProgress}
                        handleCancel={() => {
                          setEditMode(false);
                          setMaterialId(null);
                          setNewMaterial({
                            title: "",
                            type: "lecture",
                            url: "",
                            file: [],
                            dueDate: "",
                            instructions: "",
                          });
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="live-session-section collapsible-section">
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => setShowSessions((prev) => !prev)}
        >
          Live Sessions {showSessions ? <FaChevronDown /> : <FaChevronRight />}
        </h2>
        {showSessions && (
          <>
            <h3>Add New Session</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await axios.post(
                    `${API_BASE_URL}/api/teacher/session/${courseId}`,
                    newSession,
                    {
                      withCredentials: true,
                    }
                  );
                  toast.success("Live session created!");
                  setLiveSessions((prev) => [...prev, res.data.session]);
                  setNewSession({
                    title: "",
                    description: "",
                    startTime: "",
                    duration: 60,
                  });
                } catch (err) {
                  toast.error("Failed to create session");
                }
              }}
              className="live-session-form"
            >
              <input
                type="text"
                placeholder="Session Title"
                value={newSession.title}
                onChange={(e) =>
                  setNewSession({ ...newSession, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newSession.description}
                onChange={(e) =>
                  setNewSession({ ...newSession, description: e.target.value })
                }
              />
              <input
                type="datetime-local"
                value={newSession.startTime}
                onChange={(e) =>
                  setNewSession({ ...newSession, startTime: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Duration (min)"
                value={newSession.duration}
                onChange={(e) =>
                  setNewSession({ ...newSession, duration: e.target.value })
                }
              />
              <button type="submit">Create Session</button>
            </form>
            {liveSessions.length === 0 ? (
              <p>No sessions yet.</p>
            ) : (
              <ul className="session-list">
                {liveSessions.map((session) => (
                  <li key={session._id} className="session-item">
                    <div
                      onClick={() => handleSessionClick(session.meetingID)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{session.title}</strong> –{" "}
                      {new Date(session.startTime).toLocaleString()}
                      <p>{session.description}</p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.get(
                            `${API_BASE_URL}/api/teacher/session/${session._id}/moderator-join`,
                            { withCredentials: true }
                          );
                          window.open(res.data.url, "_blank");
                        } catch (err) {
                          toast.error("Unable to join session.");
                        }
                      }}
                    >
                      Join Session
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      style={{ backgroundColor: "#dc3545" }}
                    >
                      Delete
                    </button>

                    {selectedMeetingId === session.meetingID && (
                      <div
                        className="recordings-list"
                        style={{ marginTop: "10px" }}
                      >
                        <h4>Recordings:</h4>
                        {sessionRecordings.length === 0 ? (
                          <p style={{ color: "#888" }}>
                            No recordings available.
                          </p>
                        ) : (
                          sessionRecordings.map((rec) => (
                            <div key={rec.recordID} className="recording-card">
                              <p>
                                <strong>Start:</strong> {rec.startTime} <br />
                                <strong>End:</strong> {rec.endTime}
                              </p>
                              {rec.playbackUrl ? (
                                <a
                                  href={rec.playbackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="playback-link"
                                >
                                  <FaPlay style={{ marginRight: "5px" }} />
                                  Watch Recording
                                </a>
                              ) : (
                                <p style={{ color: "#aaa" }}>
                                  Playback not available
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <section className="reviews-section collapsible-section">
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => setShowReviews((prev) => !prev)}
        >
          Course Reviews {showReviews ? <FaChevronDown /> : <FaChevronRight />}
        </h2>
        {showReviews && (
          <>
            {course.reviews?.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                No reviews yet.
              </p>
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
          </>
        )}
      </section>

      <style>{CourseContentStyles}</style>
    </div>
  );
};

export default CourseContent;
