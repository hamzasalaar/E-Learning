import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Admin.css";
import { toast } from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [courseStats, setCourseStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/courses`, {
          withCredentials: true,
        });
        setCourses(res.data.courses);
      } catch (err) {
        console.error("Error fetching courses:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStatusChange = (courseId, newStatus) => {
    if (newStatus === "rejected") {
      setSelectedCourseId(courseId);
      setShowRejectionModal(true);
    } else {
      updateCourseStatus(courseId, newStatus);
    }
  };

  const updateCourseStatus = async (courseId, status, rejectionReason = "") => {
    try {
      const endpoint =
        status === "approved"
          ? `${API_BASE_URL}/api/admin/course/approve/${courseId}`
          : `${API_BASE_URL}/api/admin/course/reject/${courseId}`;

      const body = status === "rejected" ? { rejectionReason } : undefined;

      await axios.put(endpoint, body, { withCredentials: true });

      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? {
                ...c,
                status,
                rejectionReason: status === "rejected" ? rejectionReason : "",
              }
            : c
        )
      );
    } catch (err) {
      console.error(
        `Error updating course status:`,
        err.response?.data || err.message
      );
    } finally {
      setShowRejectionModal(false);
      setSelectedCourseId(null);
      setRejectionReason("");
    }
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/course/delete/${courseId}`,
        { withCredentials: true }
      );
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err.message);
    } finally {
      setShowDeleteConfirmation(false);
      setCourseToDelete(null);
    }
  };

  const handleViewStats = async (courseId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/course/stats/${courseId}`,
        { withCredentials: true }
      );
      setCourseStats(res.data); // Set the course stats data to display
      setShowStatsModal(true); // Show stats modal
    } catch (err) {
      console.error("Error fetching course stats:", err.message);
    }
  };
  const handleDeleteReview = async (reviewId) => {
    console.log("Delete review from course:", courseStats._id);
    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/review/${courseStats.courseId}/${reviewId}`,
        { withCredentials: true }
      );
      toast.success("Review deleted!");
      // Refresh the course data after deletion
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/course/${courseStats.courseId}`,
        { withCredentials: true }
      );
      setCourseStats(res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review.");
    }
  };

  const filteredCourses = courses
    .filter((course) => {
      const teacherMatch =
        course.teacher?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        course.teacher?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const titleMatch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return teacherMatch || titleMatch;
    })
    .filter(
      (course) => statusFilter === "all" || course.status === statusFilter
    );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search or filter changes
  }, [searchQuery, statusFilter]);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-heading">Manage Courses</h1>

      {courses?.length > 0 ? (
        <div className="table-container">
          <div className="search-filter-bar">
            <input
              type="text"
              placeholder="Search by title or teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <table className="user-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Teacher</th>
                <th>Status</th>
                <th>Rejection Reason</th>
                <th>Enrolled Students</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses
                .slice(
                  (currentPage - 1) * coursesPerPage,
                  currentPage * coursesPerPage
                )
                .map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>
                      {course.teacher?.name || "N/A"} (
                      {course.teacher?.email || "N/A"})
                    </td>
                    <td>{course.status}</td>
                    <td>
                      {course.status === "rejected"
                        ? course.rejectionReason
                        : "-"}
                    </td>
                    <td>{course.studentsEnrolled.length || 0}</td>
                    <td>
                      <select
                        value={course.status}
                        onChange={(e) =>
                          handleStatusChange(course._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </td>
                    <td>
                      {(course.status === "approved" ||
                        course.status === "rejected") && (
                        <button
                          onClick={() => {
                            setShowDeleteConfirmation(true);
                            setCourseToDelete(course._id);
                          }}
                          style={deleteButtonStyle}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => handleViewStats(course._id)}
                        style={viewStatsButtonStyle}
                      >
                        View Stats
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ◀ Previous
            </button>

            {Array.from({
              length: Math.ceil(
                filteredCourses.filter((user) => user.status !== "deleted")
                  .length / coursesPerPage
              ),
            }).map((_, index) => (
              <button
                key={index}
                className={`pagination-btn ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(
                      courses.filter((user) => user.status !== "deleted")
                        .length / coursesPerPage
                    )
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(
                  courses.filter((user) => user.status !== "deleted").length /
                    coursesPerPage
                )
              }
              className="pagination-btn"
            >
              Next ▶
            </button>
          </div>
        </div>
      ) : (
        <p className="no-users">No courses found.</p>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Rejection Reason</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Enter reason..."
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() =>
                  updateCourseStatus(
                    selectedCourseId,
                    "rejected",
                    rejectionReason
                  )
                }
                style={submitButtonStyle}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedCourseId(null);
                  setRejectionReason("");
                }}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3>Are you sure you want to delete this course?</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => handleDelete(courseToDelete)}
                style={submitButtonStyle}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setCourseToDelete(null);
                }}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Stats Modal */}
      {showStatsModal && courseStats && (
        <div style={modalOverlayStyle}>
          <div style={statsModalStyle}>
            <h3>Course Stats</h3>
            <p>
              <strong>Total Students:</strong> {courseStats.totalStudents || 0}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {courseStats.averageRating !== null &&
              courseStats.averageRating !== undefined
                ? courseStats.averageRating.toFixed(2)
                : "N/A"}
            </p>
            <p>
              <strong>Price:</strong> {courseStats.price}
            </p>
            <p>
              <strong>Number of Reviews:</strong> {courseStats.numberOfReviews}
            </p>

            <h4>Reviews</h4>
            <div style={reviewsContainerStyle}>
              {Array.isArray(courseStats.reviews) &&
              courseStats.reviews.length > 0 ? (
                courseStats.reviews.map((review) => (
                  <div key={review._id} style={reviewStyle}>
                    <p>
                      <strong>{review.studentName}</strong> ({review.rating}{" "}
                      stars)
                    </p>
                    <p>{review.comment}</p>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="delete-review-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              style={closeButtonStyle}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

// Inline Styles for Modals
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "400px",
  borderRadius: "8px",
  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
};

const statsModalStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
  borderRadius: "8px",
  boxShadow: "0 0 15px rgba(0,0,0,0.3)",
};

const reviewsContainerStyle = {
  marginTop: "20px",
  maxHeight: "300px",
  overflowY: "auto",
};

const reviewStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px 0",
};

const submitButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#ccc",
  color: "#000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const closeButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
};

const viewStatsButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "4px",
  cursor: "pointer",
};
