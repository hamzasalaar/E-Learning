import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import api from "../api";
import ScreenWrapper from "../components/ScreenWrapper";
import TopBar from "../components/TopBar";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({ navigation }: { navigation: DrawerNavigationProp<any> }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const nav = useNavigation<any>();

  const [courses, setCourses] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get("/public/home");
        setCourses(res.data.courses || []);
        setTutors(res.data.tutors || []);
      } catch (error) {
        console.error("Failed to load home data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      Alert.alert("Login required", "Please login or register to enroll in a course.");
      nav.navigate("Register");
      return;
    }

    if (user.role !== "student") {
      Alert.alert("Access denied", "Only students can enroll in courses.");
      return;
    }

    try {
      const res = await api.post(`/student/enroll/${courseId}`, {}, { withCredentials: true });
      if (res.data.success) {
        setEnrolledCourses((prev) => [...prev, courseId]);
        Alert.alert("Enrolled", "You have successfully enrolled in the course.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to enroll.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScreenWrapper key={user ? user.id : "guest"}>
      <TopBar />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Popular Courses</Text>
        <View style={styles.grid}> 
          {courses.map((course) => (
            <View key={course._id} style={styles.card}>
              <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
              <Text style={styles.title}>{course.title}</Text>
              <Text numberOfLines={2} style={styles.desc}>{course.description}</Text>
              <Text style={styles.price}>${course.price}</Text>
              <Text style={styles.instructor}>By {course.teacher?.name || "Instructor"}</Text>
              <TouchableOpacity
                style={[
                  styles.enrollButton,
                  enrolledCourses.includes(course._id) && styles.disabledButton,
                ]}
                onPress={() => handleEnroll(course._id)}
                disabled={enrolledCourses.includes(course._id)}
              >
                <Text style={styles.enrollText}>
                  {enrolledCourses.includes(course._id) ? "Enrolled" : "Enroll"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Tutors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20 }}>
          {tutors.map((tutor) => (
            <View key={tutor._id} style={styles.tutorCard}>
              <Feather name="user" size={32} color="#007bff" />
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <Text style={styles.tutorEmail}>{tutor.email}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  courseImage: {
    width: "100%",
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  price: {
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  instructor: {
    color: "#555",
    fontSize: 12,
    marginBottom: 8,
  },
  enrollButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  enrollText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  tutorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
    width: 140,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  tutorName: {
    fontWeight: "600",
    marginTop: 6,
    fontSize: 14,
  },
  tutorEmail: {
    fontSize: 12,
    color: "#666",
  },
});

export default HomeScreen;
