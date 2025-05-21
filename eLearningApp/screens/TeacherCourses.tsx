import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from "../redux/store";
import api, { BASE_URL } from "../api";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList, "TeacherCourseContent">;

export default function MyCoursesTeacherScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/teacher/courses");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to load courses", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderCourse = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TeacherCourseContent", { courseId: item._id })}
    >
      <Image
        source={{ uri: `${BASE_URL}${item.imageUrl}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.detail}>Status: <Text style={styles[item.status]}>{item.status}</Text></Text>
      <Text style={styles.detail}>Price: ${item.price}</Text>
      <Text style={styles.detail}>Students Enrolled: {item.studentsEnrolled?.length || 0}</Text>
      <Text style={styles.detail}>Rating: {item.rating?.toFixed(1)}/5</Text>
      <Text style={styles.detail}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
      {item.status === "rejected" && (
        <Text style={styles.rejection}>Reason: {item.rejectionReason}</Text>
      )}
    </TouchableOpacity>
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
      ListEmptyComponent={<Text style={styles.emptyText}>No courses found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  approved: {
    color: "green",
    fontWeight: "600",
  },
  pending: {
    color: "orange",
    fontWeight: "600",
  },
  rejected: {
    color: "red",
    fontWeight: "600",
  },
  rejection: {
    color: "red",
    fontStyle: "italic",
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 40,
  },
});
