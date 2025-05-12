// eLearningApp/navigation/AppDrawer.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "../components/BottomTabNavigator";
import CustomDrawer from "../components/CustomDrawer"; // ✅ Custom drawer UI

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      id={undefined} // ✅ Required for strict TS setup
      drawerContent={(props) => <CustomDrawer {...props} />} // ✅ Inject custom drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
      }}
    >
      {/* ✅ Bottom tabs wrapped inside drawer */}
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* 🔁 You can add other drawer-accessible screens here if needed */}
      {/* <Drawer.Screen name="Help" component={HelpScreen} /> */}
    </Drawer.Navigator>
  );
}
