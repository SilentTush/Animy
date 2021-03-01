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
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

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
    setLoading(true);
    fetch("https://animyserver.herokuapp.com/api/recentlyadded/1")
      .then((res) => res.json())
      .then((doc) => {
        setdata(doc.results);
        setLoading(false);
      });
  }, []);

  return (
    <View style={s.mainView}>
      <StatusBar backgroundColor="black" barStyle="light-content"></StatusBar>
      <View>
        <Text style={s.heading}>Recent Episodes</Text>
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
                padding: 0,
                width: Dimensions.get("screen").width,
                paddingBottom: 80,
              }}
              renderItem={({ item }) => {
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
              }}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        )}
      </View>
    </View>
  );
};

export default Home;

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
    height: "100%",
    paddingTop: 0,
    paddingBottom: 40,
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
  card: {
    margin: scaledSize(8),
    height: scaledSize(250),
    width: scaledSize(180),
    borderRadius: 18,
    position: "relative",
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
  darkBack: {
    position: "absolute",
    bottom: 0,
    zIndex: 4,
    height: 150,
    width: scaledSize(180),
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
});
