import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Logout } from "../redux/AuthSlice";
import {
  FaUser,
  FaDollarSign,
  FaBell,
  FaEnvelope,
  FaCog,
  FaMoneyCheckAlt,
  FaChalkboardTeacher,
  FaHome,
  FaBook,
} from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function TeacherSidebar({ collapsed, isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        isOpen ? "open" : ""
      }`}
    >
      {/* User Info */}
      <div className="user-profile-top">
        <div className="user-info">
          <img
            src={
              user?.picture
                ? `${API_BASE_URL}${user.picture}`
                : "https://via.placeholder.com/60"
            }
            alt="Profile"
            className="profile-pic"
          />
          <span className="user-name">{user?.name || "Guest"}</span>
        </div>
        <Link to="/teacher/profile" className="update-profile-button">
          Update Profile
        </Link>
      </div>

      {/* Navigation */}
      <nav className="menu">
        <Link
          to="/teacher/dashboard"
          className={`menu-item ${
            isActive("/teacher/dashboard") ? "active" : ""
          }`}
        >
          <FaHome />
          <span className="menu-text">Dashboard</span>
        </Link>
        <Link
          to="/teacher/addcourse"
          className={`menu-item ${
            isActive("/teacher/addcourse") ? "active" : ""
          }`}
        >
          <FaChalkboardTeacher />
          <span className="menu-text">Add Course</span>
        </Link>
        <Link
          to="/teacher/teacher-courses"
          className={`menu-item ${
            isActive("/teacher/teacher-courses") ? "active" : ""
          }`}
        >
          <FaBook />
          <span className="menu-text">My Courses</span>
        </Link>
        <Link
          to="/teacher/students"
          className={`menu-item ${
            isActive("/teacher/students") ? "active" : ""
          }`}
        >
          <FaUser />
          <span className="menu-text">Students</span>
        </Link>
        <Link
          to="/teacher/notifications"
          className={`menu-item ${
            isActive("/teacher/notifications") ? "active" : ""
          }`}
        >
          <FaBell />
          <span className="menu-text">Notifications</span>
        </Link>
        {/* <Link
          to="/teacher/settings"
          className={`menu-item ${
            isActive("/teacher/settings") ? "active" : ""
          }`}
        >
          <FaCog />
          <span className="menu-text">Settings</span>
        </Link> */}
        <Link
          to="/teacher/payouts"
          className={`menu-item ${
            isActive("/teacher/payouts") ? "active" : ""
          }`}
        >
          <FaMoneyCheckAlt />
          <span className="menu-text">Payout Details</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <style>{`
        .sidebar {
  width: 240px;
  background-color: #1c1e2e;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 100vh;
  position: relative;
  transition: all 0.3s ease;
  z-index: 1000;
}

/* ✅ Collapsed Sidebar */
.sidebar.collapsed {
// display:none;
  width: 70px;
  padding: 20px 10px;
    align-items: center;

}

.sidebar.collapsed .user-profile-top,
.sidebar.collapsed .update-profile-button,
.sidebar.collapsed .user-name,
.sidebar.collapsed .logout-button {
  display: none;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
    padding: 12px 0;

  font-size: 20px;
}

.sidebar.collapsed .menu-item > span {
  display: none;
}

        .user-profile-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .profile-pic {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: bold;
          font-size: 16px;
        }

        .update-profile-button {
          margin-top: 10px;
          padding: 8px 15px;
          background-color: #0ab3a3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
        }

        .update-profile-button:hover {
          background-color: #089c8d;
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-grow: 1;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
          font-size: 16px;
          padding: 6px 10px;
          border-radius: 6px;
        }

        .menu-item:hover {
          background-color: #2d2f45;
        }

        .menu-item.active {
          background-color: #0ab3a3;
          font-weight: bold;
        }

        .logout-section {
          margin-top: auto;
          text-align: center;
        }

        .logout-button {
          padding: 10px 20px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .logout-button:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0 !important;
  }
    .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
      `}</style>
    </aside>
  );
}
