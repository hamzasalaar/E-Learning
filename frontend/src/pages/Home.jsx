import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { Logout } from "../redux/AuthSlice";

export default function Home() {
  const user = useSelector((state) => state.Auth.user);
  // console.log("User data in Home: ", user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const gotoAdmin = () => {
    navigate("/admin");
  };
  const handleLogout = async () => {
    try {
      const request = await post("/api/auth/logout");
      if (request.status == 200) {
        dispatch(Logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="home-container">
        <div className="user-card">
          <h2> Welcome, {user && user.name}</h2>
          <br />
          {user && user.role == "admin" ? (
            <button className="register-button" onClick={gotoAdmin}>
              Go To Admin Dashboard
            </button>
          ) : (
            ""
          )}
          <button className="register-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
