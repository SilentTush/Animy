import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
// Returns an MMKV Instance

const baseWidth = 411;
const baseHeight = 771;
const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const scaledSize = (size) => Math.ceil(size * scale);
const Card = ({ item, navigation }) => {
  const [isfav, setisfav] = useState(false);

  useEffect(() => {
    xx();
    async function xx() {
      let x = await AsyncStorage.getItem("fav");
      if (x === null) return;
      let favarray = JSON.parse(x);
      if (favarray.some((e) => e.id === item.id)) {
        setisfav(true);
      }
    }
  }, []);
  async function addtofav() {
    let x = await AsyncStorage.getItem("fav");
    let favarray = [];
    if (x === null) {
      setisfav(true);
      favarray.push(item);
    } else {
      favarray = JSON.parse(x);
      if (favarray.some((e) => e.id === item.id)) {
        const index = favarray.findIndex((e) => e.id === item.id);
        setisfav(false);
        favarray.splice(index, 1);
      } else {
        favarray.push(item);
        setisfav(true);
      }
    }
    await AsyncStorage.setItem("fav", JSON.stringify(favarray));
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Info", {
          id: item.id,
        })
      }
      style={s.card}
      key={item.id}
    >
      <TouchableOpacity style={s.heartblank} onPress={addtofav}>
        {!isfav ? (
          <AntDesign
            name="hearto"
            size={24}
            color="white"
          />
        ) : (
          <AntDesign name="heart" size={24} color="red" />
        )}
      </TouchableOpacity>
      <Text style={s.cardTitle}>{item.title}</Text>
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        start={[0, 1]}
        end={[0, 0]}
        style={s.darkBack}
      />
      <Image
        style={s.image}
        source={{
          uri: item.image,
        }}
      ></Image>
    </TouchableOpacity>
  );
};

export default Card;

const s = StyleSheet.create({
  card: {
    margin: scaledSize(8),
    height: scaledSize(250),
    width: scaledSize(180),
    borderRadius: 18,
  },
  cardTitle: {
    zIndex: 5,
    justifyContent: "center",
    position: "absolute",
    fontFamily: "Barlow-Medium",
    color: "rgb(224, 224, 224)",
    width: scaledSize(130),
    flexDirection: "row",
    bottom: 0,
    fontSize: scaledSize(14),
    paddingHorizontal: 10,
    paddingVertical: 20,
    textAlign: "center",
    width: "100%",
    alignItems: "center",
  },
  cardEpisode: {
    zIndex: 5,
    justifyContent: "center",
    position: "absolute",
    fontFamily: "Barlow-Medium",
    color: "rgb(255, 255, 255)",
    width: scaledSize(130),
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
    top: scaledSize(15),
    fontSize: scaledSize(14),
    paddingHorizontal: 10,
    textAlign: "center",
    width: scaledSize(100),
    borderRadius: 20,
    height: scaledSize(20),
    alignSelf: "center",
    alignItems: "center",
  },
  darkBack: {
    position: "absolute",
    bottom: 0,
    zIndex: 4,
    height: 150,
    width: scaledSize(180),
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  image: {
    height: scaledSize(250),
    width: scaledSize(180),
    resizeMode: "cover",
    borderRadius: scaledSize(20),
    zIndex: 3,
  },
  heartblank: {
    height: scaledSize(50),
    position: "absolute",
    zIndex: 10,
    width: scaledSize(50),
    paddingLeft: scaledSize(10),
    paddingBottom: scaledSize(10),
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: 0,
  },
});
