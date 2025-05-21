import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import api from "../api";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/teacher/courses", {
          params: { limit: 1000 },
        });
        if (res.data.success) {
          setCourses(res.data.courses);
        } else {
          setError("Failed to load courses.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const totalCourses = courses.length;
  const approved = courses.filter((c) => c.status === "approved").length;
  const pending = courses.filter((c) => c.status === "pending").length;
  const rejected = courses.filter((c) => c.status === "rejected").length;
  const totalStudents = courses.reduce(
    (acc, course) => acc + (course.studentsEnrolled?.length || 0),
    0
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome, Teacher 👋</Text>
      <Text style={styles.subtext}>Here’s a quick summary of your course activity:</Text>

      <View style={styles.card}><Text style={styles.title}>Total Courses</Text><Text style={styles.value}>{totalCourses}</Text></View>
      <View style={[styles.card, styles.approved]}><Text style={styles.title}>Approved</Text><Text style={styles.value}>{approved}</Text></View>
      <View style={[styles.card, styles.pending]}><Text style={styles.title}>Pending</Text><Text style={styles.value}>{pending}</Text></View>
      <View style={[styles.card, styles.rejected]}><Text style={styles.title}>Rejected</Text><Text style={styles.value}>{rejected}</Text></View>
      <View style={[styles.card, styles.students]}><Text style={styles.title}>Total Enrollments</Text><Text style={styles.value}>{totalStudents}</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2c3e50",
  },
  subtext: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
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
    color: "#008080",
  },
  approved: {
    borderLeftColor: "#27ae60",
    borderLeftWidth: 4,
  },
  pending: {
    borderLeftColor: "#f39c12",
    borderLeftWidth: 4,
  },
  rejected: {
    borderLeftColor: "#e74c3c",
    borderLeftWidth: 4,
  },
  students: {
    borderLeftColor: "#2980b9",
    borderLeftWidth: 4,
  },
});
