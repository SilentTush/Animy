import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import { scaledSize } from "../Screens/Home";

import end from "../assets/images/end.png";

const BottomSlider = ({ ep, navigation, setshow, id, title }) => {
  const epList = () => {
    let L = [];
    for (var i = ep, k = 0; i >= 1; i--, k++) {
      L[k] = i;
    }
    return L;
  };

  return (
    <View style={s.main}>
      <TouchableNativeFeedback
        onPress={() => {
          setshow(false);
        }}
      >
        <View style={s.close}>
          <Image
            resizeMode="cover"
            style={{ width: "90%", height: "90%" }}
            source={end}
          ></Image>
        </View>
      </TouchableNativeFeedback>
      <SafeAreaView
        style={{
          width: "100%",
          marginTop: scaledSize(35),
        }}
      >
        <FlatList
          style={s.scroll}
          data={epList()}
          numColumns={7}
          contentContainerStyle={{
            width: "100%",
            backgroundColor: "#1d1d1d",
            padding: scaledSize(10),
            alignItems: "center",
          }}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("pp", {
                    ep: item,
                    id: id,
                    title: title,
                    totalep: ep,
                  })
                }
                style={s.ep}
              >
                <Text style={s.epTxt}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </SafeAreaView>
    </View>
  );
};

export default BottomSlider;

const s = StyleSheet.create({
  close: {
    width: scaledSize(40),
    height: scaledSize(40),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    top: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  ep: {
    width: scaledSize(40),
    height: scaledSize(50),
    backgroundColor: "#ffffff",
    margin: scaledSize(4),
    borderRadius: scaledSize(10),
  },
  epTxt: {
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(20),
    textAlign: "center",
    textAlignVertical: "center",
    color: "black",
    width: "100%",
    height: "100%",
    paddingBottom: scaledSize(4),
  },
  main: {
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: scaledSize(15),
    borderTopLeftRadius: scaledSize(15),
    flex: 1,
    backgroundColor: "#1d1d1d",
    width: Dimensions.get("window").width,
    height: scaledSize(330),
    zIndex: 7,
    padding: 20,
  },
  scroll: {
    width: "100%",
    alignSelf: "center",
  },
});
