import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import axios from "axios";
import "../css/Admin.css"; // Make sure this is the path to your new CSS file

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await axios.get(
          "http://localhost:3000/api/admin/getuser",
          { withCredentials: true }
        );
        const response = request.data;
        if (response.success) {
          setUsers(response.data);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access!");
          navigate("/"); // Redirect to login if unauthorized
        } else {
          console.error(error);
          setError("An error occurred while fetching users.");
        }
      } finally {
        setLoading(false);
      }
    };

    GetUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const request = await axios.post(
        `http://localhost:3000/api/admin/deleteuser/${id}`,
        {},
        { withCredentials: true }
      );
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== id)); // Update the list after deletion
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role); // Set the role for editing
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/updateuser/${editingUser}`,
        { name: editName, email: editEmail, role: editRole },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("User updated successfully!");
        setUsers(
          users.map((user) =>
            user._id === editingUser
              ? { ...user, name: editName, email: editEmail, role: editRole }
              : user
          )
        );
        setEditingUser(null);
      }
    } catch (error) {
      if (error.response) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const request = await axios.post("http://localhost:3000/api/auth/logout");
      if (request.status === 200) {
        dispatch(Logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      <h3 className="user-list-title">User List</h3>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-users">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td
                    className={`user-role ${
                      user.role === "admin" ? "admin-role" : "user-role"
                    }`}
                  >
                    {editingUser === user._id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <>
                        <button className="update-btn" onClick={handleUpdate}>
                          Update
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingUser(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br />
        <button className="register-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
