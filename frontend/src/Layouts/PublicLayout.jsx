import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export default function PublicLayouts() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // Redirect admin to the admin-specific area
      } else if (user.role === "student") {
        navigate("/student"); // Redirect student to the student dashboard
      } else if (user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/"); // Redirect to home if role is not recognized
      }
    }
  }, [user, navigate]);
  return <Outlet />;
}
