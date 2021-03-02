import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { scaledSize } from "./Home";
import { FontAwesome } from "@expo/vector-icons";
const Favorite = ({ navigation }) => {
  const [favArray, setFavArray] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      xx();
      async function xx() {
        let x = await AsyncStorage.getItem("fav");
        if (x !== null) setFavArray(JSON.parse(x));
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  async function remove(id) {
    let x = await AsyncStorage.getItem("fav");
    let favarray = [];
    if (x === null) {
      return;
    } else {
      favarray = JSON.parse(x);
      if (favarray.some((e) => e.id === id)) {
        const index = favarray.findIndex((e) => e.id === id);
        favarray.splice(index, 1);
      }
    }
    setFavArray(favarray);
    await AsyncStorage.setItem("fav", JSON.stringify(favarray));
  }
  useEffect(() => {
    console.log(favArray);
  }, [favArray]);
  return (
    <View style={s.mainView}>
      <StatusBar backgroundColor="black" barStyle="light-content"></StatusBar>
      <View>
        {favArray && favArray.length > 0 ? (
          <>
            <SafeAreaView style={s.container}>
              <FlatList
                data={favArray}
                bounces={true}
                numColumns={2}
                contentContainerStyle={{
                  alignItems: "center",
                  width: Dimensions.get("screen").width,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Info", {
                          id: item.id,
                        })
                      }
                      style={s.card2}
                    >
                      <TouchableOpacity
                        style={s.heartblank}
                        onPress={() => remove(item.id)}
                      >
                        <FontAwesome
                          name="remove"
                          size={scaledSize(20)}
                          color="#ffaeae"
                        />
                      </TouchableOpacity>

                      <Text style={s.cardTitle}>{item.title}</Text>
                      {/* <Text
                        style={s.cardEpisode}
                      >{`Episode: ${item.currentEpisode}`}</Text> */}
                      <LinearGradient
                        // Background Linear Gradient
                        colors={["rgba(0,0,0,0.8)", "transparent"]}
                        start={[0, 1]}
                        end={[0, 0]}
                        style={s.darkBack2}
                      />
                      <Image
                        style={s.image}
                        source={{
                          uri: item.image,
                        }}
                      ></Image>
                    </TouchableOpacity>
                  );
                }}
              />
            </SafeAreaView>
          </>
        ) : null}
      </View>
    </View>
  );
};

export default Favorite;

const s = StyleSheet.create({
  heartblank: {
    height: scaledSize(27),
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: scaledSize(27),
    marginRight: scaledSize(10),
    borderRadius: scaledSize(50),
    marginTop: scaledSize(10),
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    top: 0,
  },
  container: {
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
    height: "100%",
    paddingTop: 0,
  },
  image: {
    height: scaledSize(250),
    width: scaledSize(180),
    resizeMode: "cover",
    borderRadius: scaledSize(20),
    zIndex: 3,
  },
  mainView: {
    flex: 1,
    backgroundColor: "black",
  },
  heading: {
    color: "white",
    fontSize: scaledSize(20),
    backgroundColor: "black",
    marginLeft: scaledSize(20),
    fontFamily: "Barlow-SemiBold",
    marginTop: scaledSize(20),
    marginBottom: 4,
  },
  card2: {
    margin: scaledSize(8),
    height: scaledSize(250),
    width: scaledSize(180),
    borderRadius: 18,
  },

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
  darkBack2: {
    position: "absolute",
    bottom: 0,
    zIndex: 4,
    height: 150,
    width: scaledSize(180),
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});
