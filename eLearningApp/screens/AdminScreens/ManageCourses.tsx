import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import api from "../../api";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/admin/courses");
        setCourses(res.data.courses);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const updateCourseStatus = async (courseId, status, reason = "") => {
    try {
      const endpoint =
        status === "approved"
          ? `/admin/course/approve/${courseId}`
          : `/admin/course/reject/${courseId}`;
      const body = status === "rejected" ? { rejectionReason: reason } : undefined;
      await api.put(endpoint, body);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? { ...c, status, rejectionReason: status === "rejected" ? reason : "" }
            : c
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setRejectionModalVisible(false);
      setRejectionReason("");
    }
  };

  const handleReject = (courseId) => {
    setSelectedCourseId(courseId);
    setRejectionModalVisible(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await api.delete(`/admin/course/delete/${courseId}`);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch (error) {
      Alert.alert("Error", "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0ab3a3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.detail}>Teacher: {item.teacher?.name || "N/A"}</Text>
            <Text style={styles.detail}>Status: {item.status}</Text>
            {item.status === "rejected" && (
              <Text style={styles.rejected}>Reason: {item.rejectionReason}</Text>
            )}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => updateCourseStatus(item._id, "approved")}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(item._id)}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item._id)}
              >
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No courses available.</Text>
        }
      />

      {/* Rejection Modal */}
      <Modal visible={rejectionModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejection Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reason..."
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
            />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() =>
                  updateCourseStatus(selectedCourseId, "rejected", rejectionReason)
                }
              >
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => setRejectionModalVisible(false)}
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
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#555",
  },
  rejected: {
    color: "#d9534f",
    fontStyle: "italic",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  approveBtn: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 6,
  },
  rejectBtn: {
    backgroundColor: "#ffc107",
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginTop: 50,
  },
});
