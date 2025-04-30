import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Import the public Header
import Footer from "../components/Footer"; // Import the public Footer

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <Header /> {/* Use the public Header */}
      <main className="student-main">
        <Outlet /> {/* Render child routes */}
      </main>
      <Footer /> {/* Use the public Footer */}
    </div>
  );
};

export default StudentLayout;