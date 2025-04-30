import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the student's profile data
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
        setLoading(false);
      } catch {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="student-profile">
      <h1>Student Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
      </div>

      <style>{`
        .student-profile {
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
          font-family: Arial, sans-serif;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        .profile-details {
          margin-top: 20px;
        }

        .profile-details p {
          font-size: 16px;
          margin: 10px 0;
          color: #555;
        }

        .profile-details strong {
          color: #000;
        }
      `}</style>
    </div>
  );
}