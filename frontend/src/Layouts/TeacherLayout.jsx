import React from "react";
import { Outlet } from "react-router-dom";
import TeacherHeader from "../components/TeacherHeader"; // Make sure path is correct

export default function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <TeacherHeader />
      <Outlet />
    </div>
  );
}
