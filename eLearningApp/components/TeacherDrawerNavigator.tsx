// eLearningApp/navigation/TeacherDrawerNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TeacherDashboard from "../screens/TeacherDashboard";
import MyCoursesScreen from "../screens/TeacherCourses"; // if available
import TeacherProfile from "../screens/TeacherProfile"; // optional
import CustomDrawer from "../components/CustomDrawer"; // reuse if suitable
import AddCourseScreen from "../screens/AddCourseScreen";

const Drawer = createDrawerNavigator();

export default function TeacherDrawerNavigator() {
  return (
    <Drawer.Navigator
      id={undefined} // ✅ Add this line
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen name="Dashboard" component={TeacherDashboard} />
      <Drawer.Screen name="MyCourses" component={MyCoursesScreen} />
      <Drawer.Screen name="Add Course" component={AddCourseScreen} />
      <Drawer.Screen name="Profile" component={TeacherProfile} />
    </Drawer.Navigator>
  );
}
