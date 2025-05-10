import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";
import BottomTabNavigator from "./BottomTabNavigator";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      id={undefined} // ✅ Add this line
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: "front",
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#fff",
          width: 280,
        },
      }}
    >
      {/* Add your main tabs or screens here */}
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Optional: More drawer-accessible screens */}
    </Drawer.Navigator>
  );
}
