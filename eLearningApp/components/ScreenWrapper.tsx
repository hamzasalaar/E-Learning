// components/ScreenWrapper.tsx
import React from "react";
import { View, Platform, StatusBar } from "react-native";

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {children}
    </View>
  );
}
