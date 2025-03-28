import React from "react";
import { Link, resolvePath, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const request = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const response = request.data;

      const role = response.user.role;

      if (request.status == 200) {
        dispatch(SetUser(response.user));
        toast.success(response.message);
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/");
        }
      } else if (response.status === 403) {
        toast.error(
          "Your account is temporarily locked. Please try again later."
        );
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      setError(
        error.request?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };
  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      {error && <p className="error-message">{error}</p>} <br></br>
      {/* Display error message */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="register-link">
          Not Registered? <Link to={"/register"}>Register Here</Link>
        </p>
      </form>
    </div>
  );
}
