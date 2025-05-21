// eLearningApp/components/StudentDrawerNavigator.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/authSlice";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/StudentProfile";
import MyCoursesScreen from "../screens/MyCoursesScreen";
import NotificationScreen from "../screens/NotificationScreen";
import StudentCourseContent from "../screens/StudentCourseContent";
import CustomDrawer from "./CustomDrawer";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function StudentDrawerScreens() {
  const dispatch = useDispatch<AppDispatch>();

  const headerOptionsWithLogout: DrawerNavigationOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: "#0ab3a3" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
    headerRight: () => (
      <TouchableOpacity onPress={() => dispatch(logoutUser())}>
        <Text style={{ color: "#fff", marginRight: 16, fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    ),
  };

  return (
    <Drawer.Navigator
      id={undefined}
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerTitleAlign: "center" }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="My Courses"
        component={MyCoursesScreen}
        options={{ ...headerOptionsWithLogout, title: "My Courses" }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ ...headerOptionsWithLogout, title: "My Profile" }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ ...headerOptionsWithLogout, title: "Notifications" }}
      />
    </Drawer.Navigator>
  );
}

export default function StudentDrawerNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== "student") return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      <Stack.Screen name="StudentDrawer" component={StudentDrawerScreens} />
      <Stack.Screen
        name="StudentCourseContent"
        component={StudentCourseContent}
        options={{ headerShown: true, title: "Course Content" }}
      />
    </Stack.Navigator>
  );
}
