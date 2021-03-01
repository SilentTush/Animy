import React, { useContext, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { View, StyleSheet, TouchableNativeFeedback, Image } from "react-native";
import { Avatar, Title, Caption, Drawer, Text } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { scaledSize } from "../Screens/Home";
export function DrawerContent(props) {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={{ alignItems: "flex-end", marginRight: 15 }}>
            <AntDesign
              name="close"
              size={25}
              color="white"
              onPress={() => props.navigation.closeDrawer()}
            />
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="HOME"
            labelStyle={{
              color: "#EDEDED",
              fontSize: scaledSize(14),
              alignSelf: "center",
              fontFamily: "Barlow-Medium",
            }}
            onPress={() => {
              props.navigation.navigate("Home");
            }}
          />
        </Drawer.Section>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            label="Search"
            labelStyle={{
              color: "#EDEDED",
              fontSize: scaledSize(14),
              alignSelf: "center",
              fontFamily: "Barlow-Medium",
            }}
            onPress={() => {
              props.navigation.navigate("Search");
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerWrapper}>
        <Text style={styles.bottomDrawer}>Animy Beta v0.1</Text>
        <Text style={styles.bottomDrawer}>Made with ❤ by Tushar kushwaha</Text>
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: scaledSize(60),
    height: scaledSize(60),
  },
  container: {
    borderColor: "#1f1f1f",
    backgroundColor: "black",
    flex: 1,
  },

  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    padding: scaledSize(10),
    paddingLeft: scaledSize(25),
    flexDirection: "row",
    marginTop: 10,
  },
  title: {
    fontSize: scaledSize(15),
    marginTop: 3,
    fontFamily: "Barlow-Medium",
    marginLeft: scaledSize(10),
    color: "#EDEDED",
  },
  caption: {
    fontSize: scaledSize(14),
    lineHeight: scaledSize(14),
    color: "#EDEDED",
  },
  drawerSection: {
    marginTop: -6,
    justifyContent: "flex-start",
    alignContent: "center",
    borderColor: "#111111",
    borderBottomWidth: 1,
    marginRight: 0,
    height: scaledSize(58),
  },
  profileWrapper: {
    marginTop: scaledSize(10),
    marginBottom: scaledSize(10),
  },
  bottomDrawerWrapper: {
    alignItems: "center",
    marginBottom: scaledSize(20),
    backgroundColor: "black",
  },
  bottomDrawer: {
    fontSize: scaledSize(12),
    fontFamily: "Barlow-Medium",
    color: "#808080",
  },
  Edit: {
    color: "#EDEDED",
    backgroundColor: "#000000",
    fontSize: scaledSize(12),
    margin: scaledSize(10),
    width: scaledSize(60),
    textAlign: "center",
    fontFamily: "Barlow-Medium",
    borderWidth: 1,
    borderColor: "#525252",
    borderRadius: scaledSize(3),
    paddingTop: scaledSize(4),
  },
});
