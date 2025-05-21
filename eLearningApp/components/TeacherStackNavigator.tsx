// eLearningApp/navigation/TeacherStackNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyCoursesTeacherScreen from "../screens/TeacherCourses";
import AddCourseScreen from "../screens/AddCourseScreen";
import TeacherProfile from "../screens/TeacherProfile";
import TeacherDashboard from "../screens/TeacherDashboard";
import TeacherCourseContent from "../screens/TeacherCourseContent";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export type TeacherStackParamList = {
  Dashboard: undefined;
  MyCourses: undefined;
  AddCourse: undefined;
  Profile: undefined;
  TeacherCourseContent: { courseId: string };
};

const Stack = createNativeStackNavigator<TeacherStackParamList>();

const DrawerToggle = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ marginLeft: 10 }}
    >
      <Ionicons name="menu" size={24} color="#000" />
    </TouchableOpacity>
  );
};

export default function TeacherStackNavigator() {
  return (
    <Stack.Navigator id={undefined}>
      {[
        { name: "Dashboard", component: TeacherDashboard },
        { name: "MyCourses", component: MyCoursesTeacherScreen },
        { name: "AddCourse", component: AddCourseScreen },
        { name: "Profile", component: TeacherProfile },
      ].map(({ name, component }) => (
        <Stack.Screen
          key={name}
          name={name as keyof TeacherStackParamList}
          component={component}
          options={{
            headerLeft: () => <DrawerToggle />,
            headerTitleAlign: "center",
          }}
        />
      ))}

      <Stack.Screen
        name="TeacherCourseContent"
        component={TeacherCourseContent}
        options={{ headerTitle: "Course Content", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}
