import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice"; // Import the Logout action
import {
  FaUser,
  FaDollarSign,
  FaEnvelope,
  FaCog,
  FaMoneyCheckAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

export default function TeacherSidebar({ onLogout }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  // Access user data from Redux store
  const user = useSelector((state) => state.Auth.user); // Access the user field from the Auth slice
  // console.log(user); // Log the user data for debugging

  return (
    <aside className="sidebar">
      {/* User Profile Section */}
      <div className="user-profile-top">
        <div className="user-info">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/60"} // Use user's profile picture or a placeholder
            alt="Profile"
            className="profile-pic"
          />
          <span className="user-name">{user?.name || "Guest"}</span>{" "}
          {/* Display user's name */}
        </div>
        <button className="update-profile-button">Update Profile</button>
      </div>

      {/* Navigation Menu */}
      <nav className="menu">
        <a href="/teacher/addcourse" className="menu-item">
          <FaChalkboardTeacher /> Add Course
        </a>
        <a href="#" className="menu-item">
          <FaUser /> Students
        </a>
        <a href="#" className="menu-item">
          <FaDollarSign /> Notifications
        </a>
        <a href="#" className="menu-item">
          <FaEnvelope /> Emails
        </a>
        <a href="#" className="menu-item">
          <FaCog /> Settings
        </a>
        <a href="#" className="menu-item">
          <FaMoneyCheckAlt /> Payout Details
        </a>
      </nav>

      {/* Logout Button */}
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
        }

        .menu-item:hover {
          text-decoration: underline;
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

        /* Responsive Styles */
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding: 10px;
            justify-content: space-around;
          }

          .user-profile-top {
            display: none;
          }

          .menu {
            flex-direction: row;
            gap: 10px;
          }

          .menu-item {
            font-size: 14px;
          }

          .logout-section {
            margin-top: 0;
          }
        }
      `}</style>
    </aside>
  );
}
