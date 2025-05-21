import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import api from "../../api";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Failed to load stats.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 Admin Dashboard</Text>

      <View style={styles.statsGrid}>
        {[
          { label: "👥 Total Users", value: stats.totalUsers },
          { label: "🎓 Students", value: stats.totalStudents },
          { label: "🧑‍🏫 Teachers", value: stats.totalTeachers },
          { label: "🗂️ Total Courses", value: stats.totalCourses },
          { label: "✅ Approved", value: stats.approvedCourses },
          { label: "🕒 Pending", value: stats.pendingCourses },
          { label: "❌ Rejected", value: stats.rejectedCourses },
          { label: "📈 Enrollments", value: stats.totalEnrollments },
        ].map((item, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statText}>{item.label}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subHeader}>🏅 Top Teachers</Text>
      {stats.topTeachers?.length > 0 ? (
        stats.topTeachers.map((t: any, idx: number) => (
          <View key={idx} style={styles.teacherCard}>
            <Text style={styles.teacherText}>
              {t.name} ({t.email})
            </Text>
            <Text style={styles.teacherText}>
              📚 {t.totalCourses} courses
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No top teachers found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f7fa",
    paddingBottom: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: screenWidth / 2 - 24,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    elevation: 2,
  },
  statText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 6,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#444",
  },
  teacherCard: {
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    borderLeftColor: "#10b981",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  teacherText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },
});
