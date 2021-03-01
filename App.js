import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MainDrawer } from "./Components/drawer";

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    "Barlow-Bold": require("./assets/fonts/BarlowSemiCondensed-Bold.ttf"),
    "Barlow-ExtraBold": require("./assets/fonts/BarlowSemiCondensed-ExtraBold.ttf"),
    "Barlow-Light": require("./assets/fonts/BarlowSemiCondensed-Light.ttf"),
    "Barlow-ExtraLight": require("./assets/fonts/BarlowSemiCondensed-ExtraLight.ttf"),
    "Barlow-Regular": require("./assets/fonts/BarlowSemiCondensed-Regular.ttf"),
    "Barlow-Medium": require("./assets/fonts/BarlowSemiCondensed-Medium.ttf"),
    "Barlow-SemiBold": require("./assets/fonts/BarlowSemiCondensed-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <MainDrawer></MainDrawer>
    </NavigationContainer>
  );
}
