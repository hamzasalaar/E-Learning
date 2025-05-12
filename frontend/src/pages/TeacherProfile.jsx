import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imageUrl: "",
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/teacher/profile", {
          withCredentials: true,
        });

        const teacher = res.data.teacher;
        setProfile(teacher);
        setFormData({
          name: teacher.name,
          email: teacher.email,
          imageUrl: teacher.imageUrl || "",
        });
        setPreview(teacher.imageUrl || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "imageUrl") {
      setPreview(value);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/api/teacher/profile",
        {
          name: formData.name,
          profilePicture: formData.imageUrl, // matched to backend field
        },
        { withCredentials: true }
      );

      setProfile(res.data.teacher);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
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
                name="email"
                value={formData.email}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Profile Picture URL (Optional):</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                style={styles.input}
              />
              {preview && (
                <img src={preview} alt="Preview" style={styles.preview} />
              )}
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={handleProfileUpdate} style={styles.saveButton}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={styles.info}><strong>Name:</strong> {profile?.name}</p>
            <p style={styles.info}><strong>Email:</strong> {profile?.email}</p>
            <p style={styles.info}><strong>Role:</strong> {profile?.role}</p>
            {profile?.imageUrl && (
              <img src={profile.imageUrl} alt="Profile" style={styles.preview} />
            )}
            <button onClick={() => setIsEditing(true)} style={styles.updateButton}>
              Edit Profile
            </button>
          </>
        )}
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
