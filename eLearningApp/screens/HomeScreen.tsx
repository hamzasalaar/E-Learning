import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch, RootState } from "../redux/store";
import { logoutUser } from "../redux/authSlice";
import api from "../api";
import ScreenWrapper from "../components/ScreenWrapper";
import TopBar from "../components/TopBar";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "../types/navigation";
import { BASE_URL } from "../api";

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, "Home">>();

  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("all");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchEnrolled = async () => {
      if (user?.role === "student") {
        try {
          const res = await api.get("/student/my-courses");
          const ids = res.data.coursesWithProgress?.map((c: any) => c._id) || [];
          setEnrolledCourses(ids);
        } catch (error) {
          console.log("Enrolled fetch failed:", error.message);
        }
      }
    };
    fetchEnrolled();
  }, [user]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      Toast.show({ type: "error", text1: "Login required", text2: "Please login to enroll" });
      return;
    }

    if (user.role !== "student") {
      Toast.show({ type: "error", text1: "Students only", text2: "Only students can enroll." });
      return;
    }

    try {
      const res = await api.post(`/student/enroll/${courseId}`, {});
      if (res.data.success) {
        setEnrolledCourses((prev) => [...prev, courseId]);
        Toast.show({ type: "success", text1: "Enrolled!", text2: "You are now enrolled." });
      }
    } catch (err: any) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.response?.data?.message || "Enrollment failed",
      });
    }
  };

  const filteredCourses = courses
    .filter(
      (course: any) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <TopBar />
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Picker
            selectedValue={sort}
            style={styles.picker}
            onValueChange={(itemValue) => setSort(itemValue)}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Low to High" value="low" />
            <Picker.Item label="High to Low" value="high" />
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Popular Courses</Text>
        <View style={styles.grid}>
          {filteredCourses.map((course: any) => (
            <View key={course._id} style={styles.card}>
              <Image
                source={{ uri: `${BASE_URL}${course.imageUrl}` }}
                style={styles.courseImage}
              />
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {course.title}
              </Text>
              <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {course.description}
              </Text>
              <Text style={styles.price}>${course.price}</Text>
              <Text style={styles.instructor}>By {course.teacher?.name || "Instructor"}</Text>
              <Text style={styles.rating}>
                ⭐ {course.rating.toFixed(1)} ({course.reviews.length} reviews)
              </Text>
              {enrolledCourses.includes(course._id) ? (
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() =>
                    navigation.navigate("StudentCourseContent", { courseId: course._id })
                  }
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>View Course</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => handleEnroll(course._id)}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>Enroll</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Tutors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20 }}>
          {tutors.map((tutor: any) => (
            <View key={tutor._id} style={styles.tutorCard}>
              <Image
                source={require("../assets/gmn.png")}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <Text style={styles.tutorEmail}>{tutor.email}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <Toast />
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 10,
  },
  picker: {
    height: 40,
    width: 150,
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
    marginBottom: 12,
    minHeight: 260,
    justifyContent: "space-between",
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
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  price: {
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 2,
  },
  instructor: {
    color: "#333",
    fontSize: 12,
  },
  rating: {
    color: "#f39c12",
    fontSize: 12,
    marginBottom: 4,
  },
  enrollButton: {
    backgroundColor: "#008080",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  tutorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
    width: 140,
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