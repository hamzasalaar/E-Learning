import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/AuthSlice";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherSidebar from "../components/TeacherSideBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function TeacherLayout() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Auth?.loading || false); 
  const [collapsed, setCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dispatch updateUser when the layout is loaded
  useEffect(() => {
    dispatch(updateUser());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const toggleSidebar = () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
  };

  return (
    <div className="teacher-layout">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>

      <TeacherSidebar collapsed={!isSidebarOpen} isOpen={isSidebarOpen} />

      <div className="main-content">
        <Outlet />
      </div>

      <style>{`
        .teacher-layout {
          display: flex;
        }

        .collapse-toggle {
          position: fixed;
          top: 20px;
          left: ${collapsed ? "70px" : "240px"};
          z-index: 1001;
          padding: 8px 12px;
          background-color: #1c1e2e;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: left 0.3s ease;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          background: #f8f9fc;
          height: 100vh;
          overflow-y: auto;
          margin-left: 240px;
          transition: margin-left 0.3s ease;
        }

        .mobile-menu-toggle {
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1100;
          padding: 10px 15px;
          font-size: 18px;
          background-color: #1c1e2e;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
        }

        .teacher-layout {
          display: flex;
        }

        .main-content {
            margin-left: 0;
          }
            .sidebar.collapsed ~ .main-content {
          margin-left: 70px;
        }
      `}</style>
    </div>
  );
}
