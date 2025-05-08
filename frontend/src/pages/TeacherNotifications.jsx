import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaBookOpen,
  FaUserGraduate,
  FaExclamationCircle,
  FaBell
} from "react-icons/fa";

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/teacher/notifications", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setNotifications(res.data.notifications);
      } else {
        toast.error("Failed to load notifications.");
      }
    } catch (err) {
      toast.error("Error fetching notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:3000/api/teacher/notifications/read-all", {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("All marked as read.");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to mark all as read.");
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/teacher/notifications/${id}/read`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to mark as read.");
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case "course_approved":
        return <FaCheckCircle color="green" />;
      case "course_rejected":
        return <FaExclamationCircle color="red" />;
      case "student_enrolled":
        return <FaUserGraduate color="#007bff" />;
      case "new_review":
        return <FaBookOpen color="#ffc107" />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div className="notification-page">
      <h2>Notifications</h2>

      <button className="mark-all" onClick={markAllAsRead}>
        Mark All as Read
      </button>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="empty">No notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div key={n._id} className={`notification-item ${n.isRead ? "read" : "unread"}`}>
              <div className="icon">{getIconByType(n.type)}</div>
              <div className="text">
                <p>{n.message}</p>
                <span className="time">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              {!n.isRead && (
                <button onClick={() => markOneAsRead(n._id)} className="mark-btn">
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .notification-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          background: #fff;
          font-family: 'Segoe UI', sans-serif;
        }

        h2 {
          color: #008080;
          margin-bottom: 20px;
        }

        .mark-all {
          background: #008080;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .mark-all:hover {
          background: #006666;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.1);
          background: #f9f9f9;
        }

        .notification-item.unread {
          border-left: 5px solid #008080;
        }

        .notification-item.read {
          opacity: 0.7;
        }

        .icon {
          margin-right: 15px;
          font-size: 24px;
        }

        .text {
          flex: 1;
        }

        .text p {
          margin: 0 0 5px;
        }

        .time {
          font-size: 12px;
          color: #666;
        }

        .mark-btn {
          background: transparent;
          border: 1px solid #008080;
          color: #008080;
          border-radius: 4px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 12px;
        }

        .mark-btn:hover {
          background: #008080;
          color: white;
        }

        .empty {
          color: #777;
        }
      `}</style>
    </div>
  );
};

export default TeacherNotifications;
