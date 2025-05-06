import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../css/Admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/getuser", {
        withCredentials: true,
      });
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/admin/update/${editingUser}`,
        { name: editName, email: editEmail, role: editRole },
        { withCredentials: true }
      );
      toast.success("User updated successfully!");
      setUsers(users.map((u) =>
        u._id === editingUser ? { ...u, name: editName, email: editEmail, role: editRole } : u
      ));
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/admin/deleteuser/${id}`, {}, {
        withCredentials: true,
      });
      toast.success("User deleted!");
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Manage Users</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="4" className="no-users">No users found</td></tr>
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
                  <td>
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
                        <button className="update-btn" onClick={handleUpdate}>Update</button>
                        <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(user._id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
