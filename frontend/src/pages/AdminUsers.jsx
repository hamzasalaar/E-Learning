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
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
    fetchLoggedInUserRole();
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

  const fetchLoggedInUserRole = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/me", {
        withCredentials: true,
      });
      setLoggedInUserRole(res.data.role);
      setLoggedInUserId(res.data.user._id); // or res.data._id depending on backend
    } catch (error) {
      toast.error("Failed to fetch logged-in user info.");
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
      await axios.put(
        `http://localhost:3000/api/admin/update/${editingUser}`,
        { name: editName, email: editEmail, role: editRole },
        { withCredentials: true }
      );
      toast.success("User updated successfully!");
      setUsers(
        users.map((u) =>
          u._id === editingUser
            ? { ...u, name: editName, email: editEmail, role: editRole }
            : u
        )
      );
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(
        `http://localhost:3000/api/admin/deleteuser/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("User deleted!");
      fetchUsers();
      setShowConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Manage Users</h2>
      <div className="table-container">
        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
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
              users
                .filter((user) => user.status !== "deleted")
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .filter(
                  (user) => roleFilter === "all" || user.role === roleFilter
                )
                .slice(
                  (currentPage - 1) * usersPerPage,
                  currentPage * usersPerPage
                )
                .map((user) => (
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
                      {user._id !== loggedInUserId &&
                        (editingUser === user._id ? (
                          <>
                            <button
                              className="update-btn"
                              onClick={handleUpdate}
                            >
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
                              onClick={() => confirmDelete(user._id)}
                            >
                              Delete
                            </button>
                          </>
                        ))}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ◀ Previous
          </button>

          {Array.from({
            length: Math.ceil(
              users.filter((user) => user.status !== "deleted").length /
                usersPerPage
            ),
          }).map((_, index) => (
            <button
              key={index}
              className={`pagination-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(
                    users.filter((user) => user.status !== "deleted").length /
                      usersPerPage
                  )
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(
                users.filter((user) => user.status !== "deleted").length /
                  usersPerPage
              )
            }
            className="pagination-btn"
          >
            Next ▶
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-modal-backdrop">
          <div className="confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="modal-buttons">
              <button
                className="confirm-btn"
                onClick={() => handleDelete(userToDelete)}
              >
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;