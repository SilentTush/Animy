import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { scaledSize } from "./Home";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Components/Card";
const Search = ({ navigation }) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setresults] = useState([]);
  const [page, setpage] = useState(0);
  const [query, setquery] = useState("");

  function search(q, page) {
    setLoading(true);
    if (q !== "")
      fetch(`https://animyserver.herokuapp.com/api/search/${q}/${page}`)
        .then((res) => res.json())
        .then((doc) => {
          console.log(doc);
          if (doc) {
            setresults(doc.results);
            setLoading(false);
          } else {
            console.log("err");
          }
        });
  }
  return (
    <View style={s.container}>
      <View style={s.searchHolder}>
        <TextInput
          onChangeText={(e) => setquery(e)}
          style={s.searchBox}
          onSubmitEditing={() => {
            search(query, 0);
          }}
        ></TextInput>
        <TouchableOpacity style={s.searchButton}>
          <Ionicons
            name="search-circle"
            size={scaledSize(50)}
            color="white"
            onPress={() => search(query, 0)}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          color="white"
          style={{ marginTop: scaledSize(300) }}
        ></ActivityIndicator>
      ) : (
        <SafeAreaView style={s.container}>
          <FlatList
            data={results}
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
              return <Card item={item} navigation={navigation} />;
            }}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

export default Search;

const s = StyleSheet.create({
  searchHolder: {
    flexDirection: "row",
    backgroundColor: "black",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  searchBox: {
    backgroundColor: "#000000",
    borderColor: "#b8b8b8",
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    fontSize: scaledSize(18),
    textAlignVertical: "center",
    color: "white",
    paddingHorizontal: 10,
    fontFamily: "Barlow-Medium",
    height: scaledSize(40),
  },
  searchButton: {},
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
