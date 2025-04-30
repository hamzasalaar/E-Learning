import React, { useState } from "react";
import {
  FaUser,
  FaDollarSign,
  FaEnvelope,
  FaCog,
  FaMoneyCheckAlt,
  FaChalkboardTeacher,
  FaEllipsisV
} from "react-icons/fa";

export default function TeacherSidebar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <aside className="sidebar">
      <h2 className="brand">Teacher Dashboard</h2>

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

      {/* User Profile Section */}
      <div className="user-profile">
        <div className="user-info">
          <img
            src="https://via.placeholder.com/40" // Replace with profile picture URL if you have it
            alt="Profile"
            className="profile-pic"
          />
          <span className="user-name">Jane Doe</span>
          <button className="menu-button" onClick={handleMenuToggle}>
            <FaEllipsisV />
          </button>
        </div>

        {menuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item">Update Profile</button>
            <button className="dropdown-item" onClick={onLogout}>Logout</button>
          </div>
        )}
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

        .brand {
          font-size: 20px;
          margin-bottom: 30px;
        }

        .menu {
          display: flex;
          flex-direction: column;
          gap: 15px;
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

        .user-profile {
          margin-top: auto;
          position: relative;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .profile-pic {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: bold;
          flex-grow: 1;
        }

        .menu-button {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        .dropdown-menu {
          position: absolute;
          bottom: 60px;
          left: 20px;
          background: white;
          color: black;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-width: 160px;
          z-index: 100;
        }

        .dropdown-item {
          padding: 10px 15px;
          background: white;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f0f0f0;
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

          .brand {
            display: none;
          }

          .menu {
            flex-direction: row;
            gap: 10px;
          }

          .menu-item {
            font-size: 14px;
          }

          .user-profile {
            margin-top: 0;
          }
        }
      `}</style>
    </aside>
  );
}
