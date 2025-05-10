import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../redux/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { useNavigation } from "@react-navigation/native";

const CustomDrawer = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(Logout());
    navigation.navigate("Login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/gmn.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.profileText}>{user?.role || "Visitor"}</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />

          {user && (
            <DrawerItem
              label="My Exams"
              onPress={() => props.navigation.navigate("MyExams")}
              icon={({ color, size }) => (
                <Ionicons name="school-outline" size={size} color={color} />
              )}
            />
          )}

          {!user && (
            <>
              <DrawerItem
                label="Login"
                onPress={() => props.navigation.navigate("Login")}
                icon={({ color, size }) => (
                  <Ionicons name="log-in-outline" size={size} color={color} />
                )}
              />
              <DrawerItem
                label="Register"
                onPress={() => props.navigation.navigate("Register")}
                icon={({ color, size }) => (
                  <Ionicons name="person-add-outline" size={size} color={color} />
                )}
              />
            </>
          )}
        </View>
      </DrawerContentScrollView>

      {user && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    padding: 25,
    backgroundColor: "#0ab3a3",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  profileText: {
    fontSize: 14,
    color: "#f0f0f0",
  },
  drawerItemsContainer: {
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default CustomDrawer;
