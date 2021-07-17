import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import axios from "react-native-axios";
import { scaledSize } from "./Home";
import * as Notifications from "expo-notifications";
import { Entypo } from "@expo/vector-icons";
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";
import * as Permissions from "expo-permissions";
import { Feather } from "@expo/vector-icons";
const Episodes = ({ navigation, route }) => {
  const { episodes, ep, id, title, image } = route.params;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const channelId = "DownloadInfo";
  async function setNotificationChannel() {
    const loadingChannel = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      await Notifications.setNotificationChannelAsync(channelId, {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      });
    }
  }
  async function getCameraRollPermissions() {
    await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  }
  useEffect(() => {
    getCameraRollPermissions();
  });

  useEffect(() => {
    setNotificationChannel();
  });
  async function downloadEpisode(id, ep) {
    // "http://techslides.com/demos/sample-videos/small.mp4"
    alert("disabled temporarily");
    // var res = await axios.get(
    //   `https://animyserver.herokuapp.com/api/watching/${id}/${ep}`
    // );
    // console.log(
    //   "ee" + res.data.links[0].name == "(HDP - mp4)"
    //     ? res.data.links[0].link
    //     : res.data.links[res.data.links.length - 1].link
    // );

    // await downloadToFolder(
    //   res.data.links[0].name == "(HDP - mp4)"
    //     ? res.data.links[0].link
    //     : res.data.links[res.data.links.length - 1].link,
    //   `${title} Ep:${ep}.mp4`,
    //   `Animy/${title}`,
    //   channelId
    // );
  }
  return (
    <View style={s.container}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={episodes}
          numColumns={1}
          style={s.flatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <View style={s.episodeItem}>
                <Image style={s.image} source={{ uri: image }}></Image>
                <Text style={s.epTxt}>{`Episode ${
                  item.name.split(" ")[1]
                }`}</Text>
                <TouchableOpacity
                  onPress={() => downloadEpisode(id, item)}
                  style={s.ep}
                >
                  <Feather
                    name="download"
                    size={scaledSize(20)}
                    color="black"
                  />
                  <Text style={s.buttontxt}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Player", {
                      data: episodes,
                      animeid: id,
                      index: index,
                      time: 0,
                      title,
                      image,
                    })
                  }
                  style={s.ep}
                >
                  <Entypo
                    name="controller-play"
                    size={scaledSize(20)}
                    color="black"
                  />
                  <Text style={s.buttontxt}>Play</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        ></FlatList>
      </SafeAreaView>
    </View>
  );
};

export default Episodes;

const s = StyleSheet.create({
  episodeItem: {
    backgroundColor: "#1d1d1d",
    margin: scaledSize(2),
    borderRadius: 5,
    flexDirection: "row",
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Barlow-Medium",
    height: scaledSize(50),
    backgroundColor: "#ffffff",
    margin: scaledSize(4),
    padding: scaledSize(10),
    borderRadius: scaledSize(10),
  },
  buttontxt: {
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(14),
    paddingBottom: 3,
    marginLeft: 5,
  },
  epTxt: {
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(20),
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    marginHorizontal: scaledSize(20),
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
  flatList: {
    flex: 1,
    backgroundColor: "black",
  },
  image: {
    borderRadius: 20,
    width: scaledSize(70),
    resizeMode: "cover",
    height: scaledSize(70),
  },
});
