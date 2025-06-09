import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/teacher/profile",
          {
            withCredentials: true,
          }
        );
        setTeacher(data.teacher);
        setName(data.teacher.name);
        setPreview(`http://localhost:3000${data.teacher.picture}`);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const formData = new FormData();
    formData.append("name", name);
    if (profilePic) formData.append("profilePic", profilePic);
    if (password) formData.append("password", password);

    try {
      const res = await axios.put(
        "http://localhost:3000/api/teacher/update-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setTeacher(res.data.user);
      setPreview(`http://localhost:3000${res.data.user.picture}`);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!teacher) return <p>Loading...</p>;

  return (
    <div className="teacher-profile">
      <h2>My Profile</h2>
      <img src={preview} alt="Profile" className="profile-image" />

      {isEditing ? (
        <form onSubmit={handleUpdate} className="profile-form">
          <label>
            Change Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProfilePic(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>

          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            New Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          <div className="btn-group">
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <p>
            <strong>Name:</strong> {teacher.name}
          </p>
          <p>
            <strong>Email:</strong> {teacher.email}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}

      <style>{`
        .teacher-profile {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .profile-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 20px;
        }

        .profile-form label {
          display: block;
          margin: 15px 0 5px;
        }

        .profile-form input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-group {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .btn-group button {
          padding: 10px 15px;
          background: #00796b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-group button:last-child {
          background: #aaa;
        }

        .profile-view p {
          margin: 10px 0;
        }

        .profile-view button {
          margin-top: 20px;
          padding: 10px 15px;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
