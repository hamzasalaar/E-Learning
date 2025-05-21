import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import api from "../../api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
    fetchLoggedInUser();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/getuser");
      setUsers(res.data.data);
    } catch {
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const res = await api.get("/admin/me");
      setLoggedInUserId(res.data.user._id);
    } catch {
      Alert.alert("Error", "Failed to fetch logged-in user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/admin/update/${editingUserId}`, {
        name: editName,
        email: editEmail,
        role: editRole,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUserId ? { ...u, name: editName, email: editEmail, role: editRole } : u
        )
      );
      setEditingUserId(null);
    } catch {
      Alert.alert("Error", "Update failed");
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setConfirmModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await api.post(`/admin/deleteuser/${userToDelete}`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete));
    } catch {
      Alert.alert("Error", "Delete failed");
    } finally {
      setConfirmModalVisible(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole && u.status !== "deleted";
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <TextInput
        placeholder="Search by name or email"
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextInput
        placeholder="Filter by role (admin/teacher/student)"
        style={styles.input}
        value={roleFilter}
        onChangeText={setRoleFilter}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0ab3a3" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {editingUserId === item._id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Name"
                  />
                  <TextInput
                    style={styles.input}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Email"
                  />
                  <TextInput
                    style={styles.input}
                    value={editRole}
                    onChangeText={setEditRole}
                    placeholder="Role"
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                      <Text style={styles.btnText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setEditingUserId(null)}
                    >
                      <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.detail}>👤 {item.name}</Text>
                  <Text style={styles.detail}>✉️ {item.email}</Text>
                  <Text style={styles.detail}>🛡️ Role: {item.role}</Text>

                  {item._id !== loggedInUserId && (
                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                        <Text style={styles.btnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => confirmDelete(item._id)}
                      >
                        <Text style={styles.btnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        />
      )}

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text>Are you sure you want to delete this user?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#0ab3a3",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
  },
  updateBtn: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
  },
  deleteBtn: {
    backgroundColor: "#e63946",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
  },
  cancelBtn: {
    backgroundColor: "#aaa",
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
