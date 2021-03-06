import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Card from "../Components/Card";
import axios from "axios";
import { base_url } from "../apis";
import { ScrollView } from "react-native";
const { width, height } = Dimensions.get("window");
// Returns an MMKV Instance

const baseWidth = 411;
const baseHeight = 771;
const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const scaledSize = (size) => Math.ceil(size * scale);

const Home = ({ navigation }) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prevWatching, setPrevWatching] = useState(null);
  const [prevArray, setPrevArray] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      xx();
      async function xx() {
        let x = await AsyncStorage.getItem("prevArray");
        if (x !== null) setPrevArray(JSON.parse(x));
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    setLoading(true);
    checkstatus();
    axios
      .get(base_url + "/api/homedata/" + "trending")
      .then((response) => {
        setdata(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  async function checkstatus() {
    axios
      .get(base_url + "/checkupdate")
      .then((response) => {
        if (response.data.toString() !== "0.9") {
          alert("A new update is available download it to avoid bugs.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function remove(id) {
    let x = await AsyncStorage.getItem("prevArray");
    let prevArray = [];
    if (x === null) {
      return;
    } else {
      prevArray = JSON.parse(x);
      if (prevArray.some((e) => e.animeId === id)) {
        const index = prevArray.findIndex((e) => e.id === id);
        prevArray.splice(index, 1);
      }
    }
    setPrevArray(prevArray);
    await AsyncStorage.setItem("prevArray", JSON.stringify(prevArray));
  }
  return (
    <View style={s.mainView}>
      <StatusBar backgroundColor="black" barStyle="light-content"></StatusBar>
      <ScrollView style={{ flex: 1 }}>
        {prevArray && prevArray.length > 0 ? (
          <>
            <Text style={s.heading}>You were watching</Text>
            <SafeAreaView style={{ height: scaledSize(270) }}>
              <FlatList
                data={prevArray.reverse()}
                horizontal
                bounces={true}
                contentContainerStyle={{
                  alignItems: "center",
                  marginLeft: scaledSize(10),

                  padding: 0,
                  paddingBottom: 0,
                }}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Player", {
                          time: item.time,
                          data: item.data,
                          animeid: item.animeid,
                          index: item.index,
                          title: item.title,
                          image: item.image,
                        })
                      }
                      style={s.card2}
                      key={`watching${item.animeid}`}
                    >
                      <TouchableOpacity
                        style={{
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
                          paddingBottom: 1,
                          paddingLeft: 0.4,
                          right: 0,
                          top: 0,
                        }}
                        onPress={() => remove(item.animeId)}
                      >
                        <FontAwesome
                          name="remove"
                          size={scaledSize(20)}
                          color="#ffaeae"
                        />
                      </TouchableOpacity>
                      <Text style={s.cardTitle}>{item.animeName}</Text>
                      <Text
                        style={s.cardEpisode}
                      >{`Episode: ${item.currentEpisode}`}</Text>
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
                keyExtractor={(item) => item.animeId}
              />
            </SafeAreaView>
          </>
        ) : null}
        <Text style={s.heading}>Latest episodes</Text>
        {loading ? (
          <ActivityIndicator
            color="white"
            style={{ marginTop: scaledSize(300) }}
          ></ActivityIndicator>
        ) : (
          <SafeAreaView style={s.container}>
            <FlatList
              data={data}
              numColumns={2}
              alwaysBounceVertical={true}
              bounces={true}
              contentContainerStyle={{
                alignItems: "center",
              }}
              renderItem={({ item }) => {
                return (
                  <Card
                    scaledSize={scaledSize}
                    item={item}
                    navigation={navigation}
                  />
                );
              }}
              keyExtractor={(item) => `watching${item.id}`}
            />
          </SafeAreaView>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const s = StyleSheet.create({
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
  container: {
    backgroundColor: "rgb(0, 0, 0)",
    flex: 1,
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
