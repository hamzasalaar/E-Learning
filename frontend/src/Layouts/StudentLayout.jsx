// StudentLayout.js
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/StudentLayout.css"; // Import your CSS file for styling

const StudentLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const request = await axios.post("http://localhost:3000/api/auth/logout");
      if (request.status == 200) {
        dispatch(Logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="student-layout">
      <nav className="sidebar">
        <div className="logo">Student Portal</div>
        <ul>
          <li>
            <Link to="">Dashboard</Link>
          </li>
          <li>
            <Link to="/student/courses">My Courses</Link>
          </li>
          <li>
            <Link to="/student/profile">Profile</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
