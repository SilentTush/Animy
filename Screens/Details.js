import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Pressable,
  ScrollView,
} from "react-native";
import { scaledSize } from "./Home";
import BottomSheet from "react-native-gesture-bottom-sheet";
import BottomSlider from "../Components/BottomSlider";
const Details = ({ navigation, route }) => {
  const [id, setId] = useState(route.params.id);
  const [loading, setLoading] = useState(false);
  const [showEp, setShowEp] = useState(false);
  const [details, setdetails] = useState({});
  useEffect(() => {
    setLoading(true);
    ff();
    async function ff() {
      fetch(`https://animyserver.herokuapp.com/api/details/${id}`)
        .then((res) => res.json())
        .then((doc) => {
          setdetails(doc.results[0]);
          setLoading(false);
        });
    }
  }, [id]);
  return (
    <View style={s.main}>
      {loading ? (
        <ActivityIndicator></ActivityIndicator>
      ) : (
        <View style={s.wrapper}>
          <LinearGradient
            // Background Linear Gradient
            colors={["black", "black", "rgba(0,0,0,0.8)", "transparent"]}
            start={[0, 1]}
            end={[0, 0]}
            style={s.darkBack}
          />
          <Image style={s.image} source={{ uri: details.image }}></Image>
          <ScrollView style={s.summaryHolder}>
            <Text style={s.summary}>{details.summary}</Text>
          </ScrollView>

          <View style={s.button}>
            <TouchableNativeFeedback
              onPress={() => setShowEp(true)}
              background={TouchableNativeFeedback.Ripple("#242424", true)}
            >
              <View style={{ width: "100%" }}>
                <Text style={s.buttonText}>Episodes</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      )}
      {showEp ? (
        <BottomSlider
          navigation={navigation}
          ep={details.totalepisode}
          setshow={setShowEp}
          id={id}
          title={details.title}
        />
      ) : null}
    </View>
  );
};

export default Details;

const s = StyleSheet.create({
  summaryHolder: {
    zIndex: 4,
    position: "absolute",
    marginTop: scaledSize(350),
    textAlign: "center",
    overflow: "scroll",
    width: "100%",
    height: 250,
    paddingHorizontal: 20,
  },
  main: { flex: 1, backgroundColor: "black" },
  wrapper: {
    position: "relative",
    height: "100%",
  },
  button: {
    width: scaledSize(130),
    height: scaledSize(40),
    backgroundColor: "black",
    zIndex: 5,
    position: "absolute",
    bottom: scaledSize(60),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "Barlow-Medium",
    textAlignVertical: "center",
    textAlign: "center",
    color: "white",
    width: "100%",
    paddingBottom: scaledSize(4),
  },
  image: {
    width: "100%",
    height: scaledSize(450),
    resizeMode: "cover",
    zIndex: 1,
  },
  summary: {
    fontFamily: "Barlow-Medium",
    color: "white",
    zIndex: 4,
    textAlign: "center",
  },
  darkBack: {
    position: "absolute",
    bottom: 0,
    zIndex: 4,
    height: scaledSize(650),
    width: "100%",
  },
});
