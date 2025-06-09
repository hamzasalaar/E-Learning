import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FaDownload, FaLink, FaCheckCircle } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../css/StudentCourseContent.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function StudentCourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaterials, setShowMaterials] = useState(true);
  const [showSessions, setShowSessions] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [sessionRecordings, setSessionRecordings] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedRating, setEditedRating] = useState(5);
  const [editedComment, setEditedComment] = useState("");

  const user = useSelector((state) => state.Auth.user);

  const handleUnenroll = () => {
    confirmAlert({
      title: "Confirm Unenroll",
      message:
        "Are you sure you want to unenroll from this course? You will lose access to materials and sessions.",
      buttons: [
        {
          label: "Yes, Unenroll",
          onClick: async () => {
            try {
              const res = await axios.post(
                `${API_BASE_URL}/api/student/unenroll/${courseId}`,
                {},
                { withCredentials: true }
              );

              if (res.data.success) {
                toast.success("You have been unenrolled.");
                navigate("/student/my-courses");
              }
            } catch (err) {
              console.error("Unenroll failed:", err);
              toast.error("Failed to unenroll.");
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {}, // just close
        },
      ],
    });
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, materialsRes, sessionsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/student/courses/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(
            `${API_BASE_URL}/api/student/courses/${courseId}/materials`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `${API_BASE_URL}/api/student/course/${courseId}/live-sessions`,
            {
              withCredentials: true,
            }
          ),
        ]);

        setCourse(courseRes.data.course);
        const alreadyReviewed = courseRes.data.course.reviews?.some(
          (r) => r.user?._id === user?._id
        );
        setHasReviewed(alreadyReviewed);

        setMaterials(materialsRes.data.materials);
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch course content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleJoinSession = async (sessionId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student/session/${sessionId}/join`,
        { withCredentials: true }
      );
      if (res.data.url) {
        window.open(res.data.url, "_blank");
      }
    } catch (err) {
      alert("Unable to join session.");
      console.error("Join session failed:", err);
    }
  };

  const handleSessionClick = async (meetingID) => {
    if (selectedMeetingId === meetingID) {
      setSelectedMeetingId(null);
      setSessionRecordings([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/student/recordings/${meetingID}`,
        {
          withCredentials: true,
        }
      );
      setSessionRecordings(res.data.recordings || []);
      setSelectedMeetingId(meetingID);
    } catch (err) {
      console.error("Failed to fetch recordings:", err);
      alert("Could not load recordings for this session.");
    }
  };
  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/student/review/${courseId}`,
        {
          withCredentials: true,
        }
      );

      toast.success("Review deleted!");
      setCourse((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewId),
      }));
      setHasReviewed(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
    }
  };
  const confirmDelete = (reviewId) => {
    confirmAlert({
      title: "Confirm Delete",
      message:
        "Are you sure you want to delete your review? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => handleDelete(reviewId),
        },
        {
          label: "Cancel",
          onClick: () => {}, // no-op
        },
      ],
    });
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
  };

  const handleUpdate = async (reviewId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/student/review/${courseId}`,
        {
          rating: editedRating,
          comment: editedComment,
        },
        { withCredentials: true }
      );

      toast.success("Review updated!");
      setCourse((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r._id === reviewId
            ? { ...r, rating: editedRating, comment: editedComment }
            : r
        ),
      }));
      setEditingReviewId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update review.");
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (!course) return <p className="center">Course not found</p>;

  return (
    <div className="student-course-content">
      <div className="course-header enhanced-student-header">
        <div className="header-top">
          <div className="header-image">
            <img
              src={`${API_BASE_URL}${course.imageUrl}`}
              alt={course.title}
              className="course-img"
            />
          </div>
          <div className="header-details">
            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <p>
                <strong>Instructor:</strong> {course.teacher?.name}
              </p>
              <p>
                <strong>Enrolled:</strong>{" "}
                {course.studentsEnrolled?.length || 0} students
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {course.rating || 0}/5
              </p>
            </div>
            <button className="unenroll-btn" onClick={handleUnenroll}>
              Unenroll from Course
            </button>
          </div>
        </div>
      </div>

      <div className="collapsible-section">
        <h3
          className="section-heading"
          onClick={() => setShowMaterials((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          Course Materials {showMaterials ? "▼" : "►"}
        </h3>

        {showMaterials && (
          <>
            {materials.length === 0 ? (
              <p>No materials available yet.</p>
            ) : (
              <div className="material-list">
                {materials.map((mat) => (
                  <div key={mat._id} className="material-card">
                    <div className="material-header">
                      <h4>{mat.title}</h4>
                      <span className={`badge badge-${mat.type}`}>
                        {mat.type.toUpperCase()}
                      </span>
                    </div>
                    {mat.instructions && (
                      <p className="instructions">📘 {mat.instructions}</p>
                    )}
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
                            href={`${API_BASE_URL}/${fp.replace(
                              /\\/g,
                              "/"
                            )}`}
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
          </>
        )}
      </div>

      <div className="collapsible-section">
        <h3
          className="section-heading"
          onClick={() => setShowSessions((prev) => !prev)}
          style={{ cursor: "pointer" }}
        >
          Live Sessions {showSessions ? "▼" : "►"}
        </h3>

        {showSessions && (
          <>
            {sessions.length === 0 ? (
              <p>No live sessions scheduled.</p>
            ) : (
              <div className="session-list">
                {sessions.map((session) => (
                  <div key={session._id} className="session-card">
                    <div
                      className="session-header"
                      onClick={() => handleSessionClick(session.meetingID)}
                      style={{ cursor: "pointer" }}
                    >
                      <h4>{session.title}</h4>
                      <span className="session-time">
                        🕒 {new Date(session.startTime).toLocaleString()}
                      </span>
                    </div>
                    <p className="session-description">{session.description}</p>
                    <button
                      className="join-session-btn"
                      onClick={() => handleJoinSession(session._id)}
                    >
                      Join Live Session
                    </button>

                    {selectedMeetingId === session.meetingID && (
                      <div className="recordings-list">
                        <h5>Session Recordings:</h5>
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
                                  rel="noreferrer"
                                  className="watch-link"
                                >
                                  🎥 Watch Recording
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="collapsible-section">
        <h3 className="section-heading">Leave a Review</h3>

        {hasReviewed ? (
          <p className="info-text">✅ You have already reviewed this course.</p>
        ) : (
          <form
            className="review-form"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await axios.post(
                  `${API_BASE_URL}/api/student/review/${courseId}`,
                  { rating: reviewRating, comment: reviewText },
                  { withCredentials: true }
                );
                toast.success("Review submitted!");
                setHasReviewed(true);

                const refreshed = await axios.get(
                  `${API_BASE_URL}/api/student/courses/${courseId}`,
                  { withCredentials: true }
                );
                setCourse(refreshed.data.course);
                const reviewed = refreshed.data.course.reviews.some(
                  (r) => r.user?._id === user?._id
                );
                setHasReviewed(reviewed);

                // Optional reset form
                setReviewRating(5);
                setReviewText("");
              } catch (err) {
                toast.error(
                  err.response?.data?.message || "Failed to submit review."
                );
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your feedback..."
                rows={4}
              />
            </div>

            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        )}

        <h3 className="section-heading">Student Reviews</h3>

        {Array.isArray(course?.reviews) && course.reviews.length > 0 ? (
          course.reviews.map((review, index) => {
            const isOwner =
              review.user?._id?.toString() === user?.id?.toString();

            const isEditing = editingReviewId === review._id;

            return (
              <div key={index} className="review-card">
                <p>
                  <strong>
                    {review.user?.name || "Anonymous"}{" "}
                    {isOwner && <span className="you-tag"><i>(You)</i></span>}
                  </strong>
                  – {review.rating} ⭐
                </p>

                {isEditing ? (
                  <>
                    <select
                      value={editedRating}
                      onChange={(e) => setEditedRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(review._id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingReviewId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{review.comment}</p>
                    <small>{new Date(review.createdAt).toLocaleString()}</small>
                    {isOwner && (
                      <div className="review-actions">
                        <button onClick={() => handleEdit(review)}>Edit</button>
                        <button onClick={() => confirmDelete(review._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
