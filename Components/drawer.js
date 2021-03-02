import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import Home, { scaledSize } from "../Screens/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import Details from "../Screens/Details";
import Play from "../Screens/Play";
import Favorite from "../Screens/Favorite";
import { DrawerContent } from "./DrawerContent";
import Search from "../Screens/Search";
import logo from "../assets/images/icon.png";
import { DarkTheme } from "@react-navigation/native";
const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
export const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Animy",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontSize: scaledSize(22),
            fontFamily: "Barlow-SemiBold",
          },
          headerTitle: (props) => (
            <View
              style={{ alignItems: "center", flexDirection: "row", flex: 1 }}
            >
              <Image
                source={logo}
                style={{ width: 30, height: 30, marginTop: 3 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "white",
                  fontFamily: "Barlow-SemiBold",
                  fontSize: scaledSize(22),
                  marginLeft: 5,
                }}
              >
                Animy
              </Text>
            </View>
          ),
          headerLeft: () => (
            <FontAwesome
              name="navicon"
              size={scaledSize(25)}
              color="white"
              style={styles.icons}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <FontAwesome
              name="search"
              size={scaledSize(25)}
              color="white"
              style={styles.searchIcon}
              onPress={() => navigation.navigate("Search")}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="Info"
        component={Details}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontFamily: "Barlow-SemiBold",
            fontSize: scaledSize(22),
          },
        }}
      />
      <HomeStack.Screen
        name="Player"
        component={Play}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontFamily: "Barlow-SemiBold",
            fontSize: scaledSize(22),
          },
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={Search}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontFamily: "Barlow-SemiBold",
            fontSize: scaledSize(22),
          },
        }}
      />
      <HomeStack.Screen
        name="Favorites"
        component={Favorite}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontFamily: "Barlow-SemiBold",
            fontSize: scaledSize(22),
          },
        }}
      />
    </HomeStack.Navigator>
  );
};
export function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeStackScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  icons: {
    marginLeft: scaledSize(10),
  },
  searchIcon: {
    marginRight: scaledSize(10),
  },
});
