import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import api, { BASE_URL } from "../api";

export default function StudentCourseContent() {
  const route = useRoute<RouteProp<RootStackParamList, "StudentCourseContent">>();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [recordings, setRecordings] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, materialsRes, sessionsRes] = await Promise.all([
          api.get(`/student/courses/${courseId}`),
          api.get(`/student/courses/${courseId}/materials`),
          api.get(`/student/course/${courseId}/live-sessions`),
        ]);
        setCourse(courseRes.data.course);
        setMaterials(materialsRes.data.materials);
        setSessions(sessionsRes.data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch course content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleJoinSession = async (sessionId: string) => {
    try {
      const res = await api.get(`/student/session/${sessionId}/join`);
      if (res.data.url) Linking.openURL(res.data.url);
    } catch (err) {
      Alert.alert("Error", "Unable to join session.");
    }
  };

  const fetchRecordings = async (meetingID: string) => {
    try {
      if (selectedMeetingId === meetingID) {
        setSelectedMeetingId(null);
        setRecordings({});
        return;
      }
      const res = await api.get(`/student/recordings/${meetingID}`);
      setRecordings({ [meetingID]: res.data.recordings || [] });
      setSelectedMeetingId(meetingID);
    } catch (err) {
      Alert.alert("Error", "Failed to load recordings.");
    }
  };

  const handleUnenroll = async () => {
    Alert.alert("Unenroll", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unenroll",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post(`/student/unenroll/${courseId}`, {});
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Unenroll failed.");
          }
        },
      },
    ]);
  };

  const submitReview = async () => {
    try {
      await api.post(`/student/review/${courseId}`, {
        rating: parseInt(reviewRating),
        comment: reviewText,
      });
      setHasReviewed(true);
    } catch {
      Alert.alert("Error", "Failed to submit review");
    }
  };

  const CustomButton = ({ title, onPress, color = "#008080" }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#008080" />;
  if (!course) return <Text style={styles.error}>Course not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `${BASE_URL}${course.imageUrl}` }} style={styles.image} />
      <Text style={styles.title}>{course.title}</Text>
      <Text>{course.description}</Text>
      <Text>Instructor: {course.teacher?.name}</Text>
      <Text>Enrolled: {course.studentsEnrolled?.length || 0}</Text>
      <Text>Rating: ⭐ {course.rating || 0}/5</Text>

      <CustomButton title="Unenroll" onPress={handleUnenroll} color="#dc3545" />

      <Text style={styles.section}>Materials</Text>
      {materials.map((m) => (
        <View key={m._id} style={styles.card}>
          <Text style={styles.bold}>{m.title}</Text>
          {m.url ? (
            <Text style={styles.link} onPress={() => Linking.openURL(m.url)}>
              Open Link
            </Text>
          ) : (
            m.filePaths?.map((f: string, i: number) => (
              <Text key={i} style={styles.link} onPress={() => Linking.openURL(`${BASE_URL}/${f}`)}>
                Download File {i + 1}
              </Text>
            ))
          )}
        </View>
      ))}

      <Text style={styles.section}>Live Sessions</Text>
      {sessions.map((s) => (
        <View key={s._id} style={styles.card}>
          <Text style={styles.bold}>{s.title}</Text>
          <Text>{s.description}</Text>
          <Text>{new Date(s.startTime).toLocaleString()}</Text>
          <CustomButton title="Join" onPress={() => handleJoinSession(s._id)} />
          <CustomButton title="Recordings" onPress={() => fetchRecordings(s.meetingID)} />
          {selectedMeetingId === s.meetingID &&
            recordings[s.meetingID]?.map((rec: any) => (
              <TouchableOpacity key={rec.recordID} onPress={() => Linking.openURL(rec.playbackUrl)}>
                <Text style={styles.link}>▶ Watch Recording</Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}

      <Text style={styles.section}>Leave a Review</Text>
      {hasReviewed ? (
        <Text>You have already reviewed this course.</Text>
      ) : (
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            value={reviewRating}
            keyboardType="numeric"
            onChangeText={setReviewRating}
          />
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={reviewText}
            onChangeText={setReviewText}
          />
          <CustomButton title="Submit Review" onPress={submitReview} />
        </View>
      )}

      <Text style={styles.section}>Reviews</Text>
      {Array.isArray(course.reviews) && course.reviews.length > 0 ? (
        course.reviews.map((r, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.bold}>{r.user?.name || "Anonymous"}</Text>
            <Text>⭐ {r.rating}</Text>
            <Text>{r.comment}</Text>
          </View>
        ))
      ) : (
        <Text>No reviews yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f2fefe" },
  image: { width: "100%", height: 160, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4, color: "#008080" },
  section: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 6, color: "#008080" },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#00808022",
    borderWidth: 1,
  },
  bold: { fontWeight: "bold", color: "#333" },
  input: {
    borderColor: "#00808088",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  link: { color: "#008080", marginTop: 4 },
  error: { color: "red", textAlign: "center", marginTop: 30 },
  button: {
    backgroundColor: "#008080",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
