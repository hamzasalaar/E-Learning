import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import api from "../api";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      return Alert.alert("Validation Error", "Please enter email and password.");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        Alert.alert("Success", res.data.message);
        dispatch(setUser(res.data.user));

      } else {
        setErrorMsg(res.data.message || "Login failed");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Login</Text>
      {errorMsg !== "" && <Text style={styles.error}>{errorMsg}</Text>}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.registerLink}>
        Not registered?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("RegisterScreen")}>
          Register Here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 20 : 60,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
  },
  heading: {
    fontSize: 28,
    color: "#667eea",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#667eea",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  link: {
    color: "#667eea",
    fontWeight: "bold",
  },
});
