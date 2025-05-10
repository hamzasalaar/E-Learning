import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import RootNavigation from "./navigation/RootNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <RootNavigation />
      </SafeAreaProvider>
    </Provider>
  );
}
