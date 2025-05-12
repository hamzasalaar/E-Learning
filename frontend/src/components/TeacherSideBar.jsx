import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Logout } from "../redux/AuthSlice";
import {
  FaUser,
  FaDollarSign,
  FaEnvelope,
  FaCog,
  FaMoneyCheckAlt,
  FaChalkboardTeacher,
  FaHome,
  FaBook,
} from "react-icons/fa";

export default function TeacherSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
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
    <aside className="sidebar">
      {/* User Info */}
      <div className="user-profile-top">
        <div className="user-info">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/60"}
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
          <FaHome /> Dashboard
        </Link>
        <Link
          to="/teacher/addcourse"
          className={`menu-item ${
            isActive("/teacher/addcourse") ? "active" : ""
          }`}
        >
          <FaChalkboardTeacher /> Add Course
        </Link>
        <Link
          to="/teacher/teacher-courses"
          className={`menu-item ${
            isActive("/teacher/teacher-courses") ? "active" : ""
          }`}
        >
          <FaBook /> My Courses
        </Link>
        <Link to="/teacher/students" className="menu-item">
          <FaUser /> Students
        </Link>
        <Link to="/teacher/notifications" className="menu-item">
          <FaDollarSign /> Notifications
        </Link>
        <Link to="#/teacher/settings" className="menu-item">
          <FaCog /> Settings
        </Link>
        <Link to="#/teacher/payouts" className="menu-item">
          <FaMoneyCheckAlt /> Payout Details
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
          flex-shrink: 0;
          height: 100vh;
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
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding: 10px;
            justify-content: space-around;
            height: auto;
          }

          .user-profile-top {
            display: none;
          }

          .menu {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
          }

          .logout-section {
            margin-top: 0;
          }
        }
      `}</style>
    </aside>
  );
}
