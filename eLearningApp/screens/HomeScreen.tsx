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
import { logoutUser } from "../redux/authSlice";
import api from "../api";
import ScreenWrapper from "../components/ScreenWrapper";
import TopBar from "../components/TopBar";

const HomeScreen = ({ navigation }: { navigation: DrawerNavigationProp<any> }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
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

  const handleLogout = () => {
    dispatch(logoutUser());
    Alert.alert("Logged out", "You have been successfully logged out.");
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
          {courses.map((course: any) => (
            <View key={course._id} style={styles.card}>
              <Image source={{ uri: course.imageUrl }} style={styles.courseImage} />
              <Text style={styles.title}>{course.title}</Text>
              <Text style={styles.price}>${course.price}</Text>
              <Text style={styles.instructor}>By {course.teacher?.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Tutors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20 }}>
          {tutors.map((tutor: any) => (
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
    marginBottom: 12,
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
  price: {
    color: "#007bff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  instructor: {
    color: "#555",
    fontSize: 12,
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuIcon: {
    paddingHorizontal: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authText: {
    color: "#007bff",
    fontSize: 16,
    marginHorizontal: 6,
    fontWeight: "500",
  },
  separator: {
    fontSize: 16,
    color: "#999",
  },
});

export default HomeScreen;
