import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminDashboard from "../screens/AdminScreens/AdminDashboard";
import ManageUsers from "../screens/AdminScreens/ManageUsers";
import ManageCourses from "../screens/AdminScreens/ManageCourses";
import AdminCustomDrawer from "./AdminCustomDrawer"; // ✅ import it

const Drawer = createDrawerNavigator();

export default function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <AdminCustomDrawer {...props} />} // ✅ use here
      id={undefined}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Manage Users" component={ManageUsers} />
      <Drawer.Screen name="Manage Courses" component={ManageCourses} />
    </Drawer.Navigator>
  );
}
