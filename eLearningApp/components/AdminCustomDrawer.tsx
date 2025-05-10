import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/authSlice";
import { useNavigation } from "@react-navigation/native";

export default function AdminCustomDrawer(props: any) {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    dispatch(Logout()); // Clear user from Redux
    navigation.navigate("LoginScreen"); // Redirect to login
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Admin</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#333" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 70,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
