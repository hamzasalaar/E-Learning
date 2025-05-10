import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import api from "../api";

export default function MyCoursesScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchCourses = async () => {
    if (!user) return;

    try {
      const url =
        user.role === "student"
          ? "/student/my-courses"
          : "/teacher/courses";
      const res = await api.get(url);
      setCourses(res.data.courses || res.data.coursesWithProgress || []);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const renderCourse = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      {user.role === "teacher" && (
        <Text style={styles.detail}>Status: {item.status}</Text>
      )}
      {user.role === "student" && item.progress && (
        <Text style={styles.detail}>
          Progress: {item.progress.percentage}%
        </Text>
      )}
      <Text style={styles.detail}>Price: ${item.price}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert("Course Clicked", `Course: ${item.title}`);
        }}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item._id}
      renderItem={renderCourse}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No courses available.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 40,
    fontSize: 16,
  },
});
