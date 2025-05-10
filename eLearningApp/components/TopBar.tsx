import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Logout } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";

export default function TopBar() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
      dispatch(Logout()); // Clear user from Redux
      navigation.navigate("LoginScreen"); // Redirect to login
    };

  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.right}>
        {!user ? (
          <>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.link}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 8,
  },
  separator: {
    fontSize: 16,
    color: "#999",
  },
});
