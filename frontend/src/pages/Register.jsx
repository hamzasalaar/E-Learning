import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password }
      );

      // Handle successful registration
      if (response.status === 201) {
        toast.success(response.data.message);
        if (response.data.success) {
          // Redirect to login page
          navigate("/login");
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "Registration failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d).{8,16}$"
            title="Password must be at least 8 characters long and contain both letters and numbers."
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </form>
    </div>
  );
}
