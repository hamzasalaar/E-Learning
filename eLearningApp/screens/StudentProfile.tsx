import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import api from "../api";
import { setUser } from "../redux/authSlice";

export default function StudentProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");

  const handleUpdate = async () => {
    try {
      const res = await api.put("/auth/update-profile", {
        name,
        password: password || undefined, // only send if provided
      });

      if (res.data.success) {
        dispatch(setUser(res.data.updatedUser));
        Alert.alert("Success", "Profile updated successfully.");
        setPassword("");
      } else {
        Alert.alert("Error", res.data.message || "Update failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student Profile</Text>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.staticField}>{user.email}</Text>

      <Text style={styles.label}>Role:</Text>
      <Text style={styles.staticField}>{user.role}</Text>

      <Text style={styles.label}>New Password (optional):</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  staticField: {
    fontSize: 16,
    marginTop: 5,
    color: "#555",
    paddingVertical: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16 },
});
