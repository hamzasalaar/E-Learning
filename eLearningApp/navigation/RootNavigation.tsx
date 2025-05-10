// eLearningApp/navigation/RootNavigation.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Navigators
import AdminDrawerNavigator from "../components/AdminDrawerNavigator";
import TeacherDrawerNavigator from "../components/TeacherDrawerNavigator";
import StudentDrawerNavigator from "../components/StudentDrawerNavigator";
import PublicNavigator from "./PublicNavigator"; // ✅ Newly created for guests

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
        {user ? (
          user.role === "admin" ? (
            <Stack.Screen name="AdminDrawer" component={AdminDrawerNavigator} />
          ) : user.role === "teacher" ? (
            <Stack.Screen name="TeacherDrawer" component={TeacherDrawerNavigator} />
          ) : (
            <Stack.Screen name="StudentDrawer" component={StudentDrawerNavigator} />
          )
        ) : (
          <Stack.Screen name="Public" component={PublicNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
