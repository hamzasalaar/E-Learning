import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import api from "../api";

export default function AddCourseScreen() {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    price: "",
    imageUrl: "",
  });

  const [lectureNotes, setLectureNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: true,
    });

    if (!result.canceled) {
      setLectureNotes(result.assets || []);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.imageUrl) {
      return Alert.alert("Error", "Please fill in all required fields.");
    }

    try {
      setLoading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value.toString())
      );

      lectureNotes.forEach((file, index) => {
        data.append("lectureNotes", {
          uri: file.uri,
          name: file.name || `file-${index}.pdf`,
          type: "application/pdf",
        } as any);
      });

      const res = await api.post("/teacher/create-course", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.status === 201 && res.data.course?._id) {
        Alert.alert("Success", "Course added!");

        // Reset form
        setFormData({
          title: "",
          description: "",
          videoUrl: "",
          price: "",
          imageUrl: "",
        });
        setLectureNotes([]);

        // Navigate
        navigation.navigate("TeacherCourseContent", {
          courseId: res.data.course._id,
        });
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Add a New Course</Text>

      {["title", "description", "imageUrl", "videoUrl", "price"].map((field, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={field === "imageUrl" ? "PostImage URL" : field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          keyboardType={field === "price" ? "numeric" : "default"}
          onChangeText={(text) => handleChange(field, text)}
          multiline={field === "description"}
        />
      ))}

      <TouchableOpacity style={styles.uploadBtn} onPress={handleFilePick}>
        <Text style={styles.uploadText}>Select Lecture Notes (PDF)</Text>
        <Text style={styles.notesInfo}>{lectureNotes.length} file(s) selected</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#008080",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  uploadBtn: {
    backgroundColor: "#eee",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  uploadText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  notesInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#008080",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
