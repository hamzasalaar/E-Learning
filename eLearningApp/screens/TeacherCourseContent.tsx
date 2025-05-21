import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import api, { BASE_URL } from "../api";
import { RootStackParamList } from "../types/navigation";

export default function TeacherCourseContent() {
  const route = useRoute<RouteProp<RootStackParamList, "TeacherCourseContent">>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("lecture");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<any[]>([]);

  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState("60");

  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, matRes, sessionRes] = await Promise.all([
          api.get(`/teacher/courses/${courseId}`),
          api.get(`/teacher/courses/${courseId}/materials`),
          api.get(`/teacher/course/${courseId}/sessions`),
        ]);
        setCourse(courseRes.data.course);
        setMaterials(matRes.data.materials || []);
        setSessions(sessionRes.data.sessions || []);
      } catch (err) {
        console.error("Failed to load course content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });
      if (!result.canceled) {
        setFiles([...files, result.assets[0]]);
      }
    } catch (error) {
      console.error("File pick error:", error);
    }
  };

  const handleMaterialSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (url) formData.append("url", url);
      files.forEach((f) => {
        formData.append("files", {
          uri: f.uri,
          name: f.name,
          type: "application/pdf",
        } as any);
      });

      const res = await api.post(`/teacher/courses/add-material/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMaterials((prev) => [...prev, res.data.material]);
      setTitle("");
      setType("lecture");
      setUrl("");
      setFiles([]);
      setShowMaterialForm(false);
    } catch (error) {
      console.error("Failed to submit material", error);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      await api.delete(`/teacher/courses/${courseId}/materials/${materialId}`);
      setMaterials((prev) => prev.filter((mat) => mat._id !== materialId));
    } catch (error) {
      console.error("Failed to delete material", error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const res = await api.post(`/teacher/session/${courseId}`, {
        title: sessionTitle,
        description: sessionDescription,
        startTime: sessionStartTime,
        duration: parseInt(sessionDuration),
      });
      setSessions((prev) => [...prev, res.data.session]);
      setSessionTitle("");
      setSessionDescription("");
      setSessionStartTime("");
      setSessionDuration("60");
      setShowSessionForm(false);
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.delete(`/teacher/session/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const res = await api.get(`/teacher/session/${sessionId}/moderator-join`);
      Linking.openURL(res.data.url);
    } catch (error) {
      console.error("Join failed", error);
    }
  };

  const fetchRecordings = async (meetingId: string) => {
    try {
      const res = await api.get(`/teacher/recordings/${meetingId}`);
      setRecordings((prev) => ({ ...prev, [meetingId]: res.data.recordings || [] }));
    } catch (err) {
      console.error("Recording fetch failed", err);
    }
  };

  const CustomButton = ({ title, onPress, color = "#008080" }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  if (!course) {
    return <Text style={styles.errorText}>Course not found</Text>;
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Image source={{ uri: `${BASE_URL}${course.imageUrl}` }} style={styles.image} />
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.meta}>Status: {course.status}</Text>
        <Text style={styles.meta}>Price: ${course.price}</Text>
        <Text style={styles.meta}>Students: {course.studentsEnrolled?.length || 0}</Text>
        <Text style={styles.meta}>Rating: {course.rating}/5</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Add New Material</Text>
      <CustomButton
        title={showMaterialForm ? "Cancel" : "➕ Add New Material"}
        onPress={() => setShowMaterialForm(!showMaterialForm)}
      />
      {showMaterialForm && (
        <>
          <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Type (lecture/assignment)" value={type} onChangeText={setType} />
          <TextInput style={styles.input} placeholder="URL (optional)" value={url} onChangeText={setUrl} />
          <CustomButton title="Pick PDF File" onPress={handleFilePick} />
          <CustomButton title="Submit Material" onPress={handleMaterialSubmit} />
        </>
      )}

      <Text style={styles.sectionTitle}>Materials</Text>
      {materials.length === 0 ? (
        <Text style={styles.infoText}>No materials available.</Text>
      ) : (
        materials.map((mat) => (
          <View key={mat._id} style={styles.card}>
            <Text style={styles.cardTitle}>{mat.title}</Text>
            <Text>Type: {mat.type}</Text>
            {mat.url && <Text>Link: {mat.url}</Text>}
            <CustomButton title="Delete" onPress={() => handleDeleteMaterial(mat._id)} color="#dc3545" />
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Live Sessions</Text>
      <CustomButton
        title={showSessionForm ? "Cancel" : "➕ Schedule Live Session"}
        onPress={() => setShowSessionForm(!showSessionForm)}
      />
      {showSessionForm && (
        <>
          <TextInput style={styles.input} placeholder="Session Title" value={sessionTitle} onChangeText={setSessionTitle} />
          <TextInput style={styles.input} placeholder="Description" value={sessionDescription} onChangeText={setSessionDescription} />
          <TextInput style={styles.input} placeholder="Start Time (YYYY-MM-DDTHH:mm)" value={sessionStartTime} onChangeText={setSessionStartTime} />
          <TextInput style={styles.input} placeholder="Duration (minutes)" value={sessionDuration} onChangeText={setSessionDuration} keyboardType="numeric" />
          <CustomButton title="Create Session" onPress={handleCreateSession} />
        </>
      )}

      {sessions.length === 0 ? (
        <Text style={styles.infoText}>No sessions available.</Text>
      ) : (
        sessions.map((s) => (
          <View key={s._id} style={styles.card}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            <Text>{s.description}</Text>
            <Text>{new Date(s.startTime).toLocaleString()}</Text>
            <CustomButton title="Join Session" onPress={() => handleJoinSession(s._id)} />
            <CustomButton title="View Recordings" onPress={() => fetchRecordings(s.meetingID)} color="#666" />
            {recordings[s.meetingID]?.map((rec) => (
              <TouchableOpacity key={rec.recordID} onPress={() => Linking.openURL(rec.playbackUrl)}>
                <Text style={{ color: "#008080", marginTop: 6 }}>▶ Watch Recording</Text>
              </TouchableOpacity>
            ))}
            <CustomButton title="Delete" onPress={() => handleDeleteSession(s._id)} color="#dc3545" />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2fefe",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2fefe",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },
  header: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginTop: 24,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderColor: "#00808088",
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderColor: "#00808022",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#008080",
    marginBottom: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
