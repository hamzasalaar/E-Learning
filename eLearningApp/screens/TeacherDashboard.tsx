import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import api from "../api";

export default function TeacherDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    enrolledStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/teacher/dashboard-stats", {
          withCredentials: true,
        });
        setCounts(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>👨‍🏫 Welcome, {user?.name || "Teacher"}</Text>

      <View style={styles.card}>
        <Text style={styles.title}>✅ Approved Courses</Text>
        <Text style={styles.value}>{counts.approved}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🕐 Pending Courses</Text>
        <Text style={styles.value}>{counts.pending}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>❌ Rejected Courses</Text>
        <Text style={styles.value}>{counts.rejected}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>👨‍🎓 Students Enrolled</Text>
        <Text style={styles.value}>{counts.enrolledStudents}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
  },
});
