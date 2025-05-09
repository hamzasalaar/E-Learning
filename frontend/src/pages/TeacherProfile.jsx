import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { updateUser } from "../redux/AuthSlice";

export default function TeacherProfile() {
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });

        setProfile(res.data.user);
        setFormData({
          name: res.data.user.name,
          email: res.data.user.email,
          profilePicture: res.data.user.profilePicture,
        });
        setPreview(res.data.user.profilePicture);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (profileImage) data.append("profilePicture", profileImage);

      const res = await axios.put(
        "http://localhost:3000/api/users/update-profile",
        data,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Profile updated");
        dispatch(updateUser());
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/change-password",
        passwordData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Password updated");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      toast.error("Failed to update password");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Teacher Profile</h1>
      <div style={styles.card}>
        {isEditing ? (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email:</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Profile Picture:</label>
              <input type="file" onChange={handleImageChange} />
              {preview && (
                <img src={preview} alt="Preview" style={styles.preview} />
              )}
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={handleProfileUpdate} style={styles.saveButton}>
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.info}>
              <strong>Name:</strong> {profile?.name}
            </p>
            <p style={styles.info}>
              <strong>Email:</strong> {profile?.email}
            </p>
            <p style={styles.info}>
              <strong>Role:</strong> {profile?.role}
            </p>
            {profile?.profilePicture && (
              <img
                src={profile.profilePicture}
                alt="Profile"
                style={styles.preview}
              />
            )}
            <button
              onClick={() => setIsEditing(true)}
              style={styles.updateButton}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Password Update */}
      <h3 style={{ marginTop: "30px", color: "#008080" }}>
        Change Password
      </h3>
      <div style={styles.card}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmNewPassword: e.target.value,
              })
            }
            style={styles.input}
          />
        </div>
        <button onClick={handlePasswordUpdate} style={styles.saveButton}>
          Change Password
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  card: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  preview: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginTop: "10px",
    objectFit: "cover",
  },
  info: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#555",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  updateButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "#dc3545",
  },
};
