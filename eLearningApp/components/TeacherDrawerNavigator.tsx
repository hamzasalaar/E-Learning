import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomDrawer from "../components/CustomDrawer";
import TeacherDashboard from "../screens/TeacherDashboard";
import MyCoursesTeacherScreen from "../screens/TeacherCourses";
import AddCourseScreen from "../screens/AddCourseScreen";
import TeacherProfile from "../screens/TeacherProfile";
import TeacherCourseContent from "../screens/TeacherCourseContent";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function TeacherDrawerScreens() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: true }}
      id={undefined}
    >
      <Drawer.Screen name="Dashboard" component={TeacherDashboard} />
      <Drawer.Screen name="MyCourses" component={MyCoursesTeacherScreen} />
      <Drawer.Screen name="Add Course" component={AddCourseScreen} />
      <Drawer.Screen name="Profile" component={TeacherProfile} />
    </Drawer.Navigator>
  );
}

export default function TeacherDrawerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
      {/* ✅ Give a unique name here */}
      <Stack.Screen name="TeacherMain" component={TeacherDrawerScreens} />
      <Stack.Screen
        name="TeacherCourseContent"
        component={TeacherCourseContent}
        options={{ headerShown: true, title: "Course Content" }}
      />
    </Stack.Navigator>
  );
}
