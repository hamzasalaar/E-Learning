import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Logout } from "../redux/AuthSlice";

export default function TeacherHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <header className="teacher-header">
        <div className="header-container">
          <Link to="/teacher/dashboard" className="logo">
            <span className="logo-text">Teacher</span>Portal
          </Link>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`nav ${menuOpen ? "active" : ""}`}>
            <Link to="/teacher/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/teacher/addcourse" className="nav-link">Add Course</Link>
            <Link to="/teacher/students" className="nav-link">Students</Link>
            <Link to="/teacher/settings" className="nav-link">Settings</Link>
          </nav>

          <div className={`auth-cart ${menuOpen ? "active" : ""}`}>
            <button onClick={handleLogout} className="logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .teacher-header {
          width: 100%;
          background-color: #1c1e2e;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          text-decoration: none;
        }

        .logo-text {
          font-weight: bold;
          color: #0ab3a3;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: #fff;
        }

        .nav {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          text-decoration: none;
          font-size: 16px;
          color: #fff;
          padding: 5px 10px;
          transition: color 0.3s ease-in-out;
        }

        .nav-link:hover {
          color: #0ab3a3;
        }

        .auth-cart {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logout {
          background-color: #0ab3a3;
          color: white;
          font-size: 14px;
          padding: 8px 15px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .logout:hover {
          background-color: #008080;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .nav,
          .auth-cart {
            display: none;
            flex-direction: column;
            width: 100%;
            margin-top: 10px;
          }

          .nav.active,
          .auth-cart.active {
            display: flex;
          }

          .header-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-link,
          .logout {
            width: 100%;
            text-align: left;
            padding: 10px 0;
          }
        }
      `}</style>
    </>
  );
}