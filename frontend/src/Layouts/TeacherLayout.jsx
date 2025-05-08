import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/AuthSlice";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherSidebar from "../components/TeacherSideBar";
import { Outlet } from "react-router-dom";

export default function TeacherLayout() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.Auth?.loading || false); // Assuming you have a loading state in your auth slice

  // Dispatch updateUser when the layout is loaded
  useEffect(() => {
    dispatch(updateUser());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message until the user data is fetched
  }

  return (
    <div className="teacher-layout">
      <TeacherSidebar />

      {/* <TeacherDashboard /> */}
      <div className="main-content">
        <Outlet />
      </div>
      <style>{`
        .teacher-layout {
          display: flex;
          height: 100vh; /* Full viewport height */
        }

        .main-content {
          flex: 1; /* Take up remaining space */
          background: #f8f9fc; /* Light background for content */
          padding: 20px; /* Add some padding */
          overflow-y: auto; /* Enable scrolling if content overflows */
        }
      `}</style>
    </div>
  );
}
