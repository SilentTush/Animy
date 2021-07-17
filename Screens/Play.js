import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  TouchableNativeFeedback,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useKeepAwake } from "expo-keep-awake";
import * as Progress from "react-native-progress";
import {
  FontAwesome5,
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { Video, AVPlaybackStatus } from "expo-av";
import DoubleClick from "react-native-double-tap";
import axios from "react-native-axios";
import { scaledSize } from "./Home";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { base_url } from "../apis";
const Play = ({ navigation, route }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataLinks, setdataLinks] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [url, setUrl] = useState("");
  const [currentTime, setcurrrentTime] = useState(0);
  const [durationTime, setdurationTime] = useState(0);
  const { data, animeid, time, index, title, image } = route.params;
  const [currentindex, setcurrentindex] = useState(index);
  const [showepmenu, setshowepmenu] = useState(false);
  const [strechedMode, setstrechedMode] = useState("contain");
  const timer = useRef(null);
  const lefttimer = useRef(null);
  const [t, st] = useState(0);
  const [backtime, setbacktime] = useState(0);
  const [showseekinfoR, setshowseekinfoR] = useState(false);
  const [showseekinfoL, setshowseekinfoL] = useState(false);
  const controlRef = useRef(null);
  const epmenuref = useRef(null);
  // to hide statusbar
  useEffect(() => {
    StatusBar.setHidden(true);
    navigation.setOptions({ headerShown: false });
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);
  useEffect(() => {
    if (!data) return;
    let uri = base_url + `/api/getlink/${data[currentindex].id}`;
    setLoading(true);
    getdata();
    async function getdata() {
      setLoading(true);
      axios.get(uri).then((res) => {
        setdataLinks([]);
        setUrl(res.data);
        setLoading(false);
      });
    }
  }, [currentindex]);

  function millisToMinutesAndSeconds(millis) {
    if (status.isLoaded === false) return "0:00";
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  //for showing time in minutes and seconds
  useEffect(() => {
    const x = status.positionMillis / status.durationMillis;
    setdurationTime(millisToMinutesAndSeconds(status.durationMillis));
    setcurrrentTime(millisToMinutesAndSeconds(status.positionMillis));
    setProgress(x);

    if (status.didJustFinish) {
      if (currentindex !== 0) setcurrentindex((prev) => prev - 1);
    }
  }, [status]);
  //changing time of video using slider
  function settime(e) {
    if (!status.isBuffering) {
      let x = e * status.durationMillis;
      video.current.setPositionAsync(x);
    }
  }
  // fot changing orientation
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);
  //for keeping screen on
  useKeepAwake();
  //setting timeout for show control

  useEffect(() => {
    if (!time || !video || !video.current) return;
    if (status.isLoaded) {
      video.current.setPositionAsync(time);
    }
  }, [status.isLoaded, time]);
  function seekForwardDoubleTap() {
    const time = new Date().getTime();
    const delta = time - t;
    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      if (status.isBuffering) return;
      video.current.setPositionAsync(status.positionMillis + 10000);
      video.current.playAsync();
      setshowseekinfoR(true);
      setTimeout(() => setshowseekinfoR(false), 300);
      if (timer.current) clearTimeout(timer.current);
    } else {
      timer.current = setTimeout(() => setShowControls(!showControls), 400);
    }
    st(time);
  }
  function seekBackwardDoubleTap() {
    const time = new Date().getTime();
    const delta = time - backtime;
    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      if (status.isBuffering) return;
      video.current.setPositionAsync(
        status.positionMillis - 10000 < 0 ? 0 : status.positionMillis - 10000
      );
      video.current.playAsync();
      setshowseekinfoL(true);
      setTimeout(() => setshowseekinfoL(false), 300);
      if (lefttimer.current) clearTimeout(lefttimer.current);
    } else {
      lefttimer.current = setTimeout(() => setShowControls(!showControls), 400);
    }
    setbacktime(time);
  }

  useEffect(() => {
    xx();
    async function xx() {
      let x = await AsyncStorage.getItem("prevArray");
      let prevArray = [];
      if (x !== null) prevArray = JSON.parse(x);
      else prevArray = null;
      if (prevArray === null) {
        prevArray = [];
        prevArray.push({
          animeid: animeid,
          currentEpisode: data[currentindex].name.split(" ")[1],
          currentEpisodeId: data[currentindex].id,
          totalEpisodes: data.length,
          animeName: title,
          time: status.positionMillis,
          image: image,
          index: currentindex,
          data,
        });
      } else if (prevArray.some((e) => e.animeid === animeid)) {
        const index = prevArray.findIndex((e) => e.animeid === animeid);
        let x = prevArray[index].image;
        prevArray[index] = {
          animeid: animeid,
          currentEpisode: data[currentindex].name.split(" ")[1],
          currentEpisodeId: data[currentindex].id,
          totalEpisodes: data.length,
          animeName: title,
          time: status.positionMillis,
          image: x,
          index: currentindex,
          data,
        };
      } else {
        prevArray.push({
          animeid: animeid,
          currentEpisode: data[currentindex].name.split(" ")[1],
          currentEpisodeId: data[currentindex].id,
          totalEpisodes: data.length,
          animeName: title,
          time: status.positionMillis,
          image: image,
          index: currentindex,
          data,
        });
      }
      await AsyncStorage.setItem("prevArray", JSON.stringify(prevArray));
    }
  }, [status.positionMillis]);

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator
          color="white"
          style={{ marginTop: scaledSize(200) }}
        ></ActivityIndicator>
      ) : (
        <View style={styles.videoHolder}>
          {showepmenu ? (
            <SafeAreaView style={styles.episodeMenu}>
              <ScrollView contentContainerStyle={styles.epContainer}>
                {data.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={item.id.toString()}
                      onPress={() => {
                        setcurrentindex(index);
                      }}
                      onPressIn={() => {
                        clearTimeout(controlRef.current);
                        clearTimeout(epmenuref.current);
                        controlRef.current = setTimeout(
                          () => setShowControls(false),
                          2000
                        );
                        epmenuref.current = setTimeout(
                          () => setshowepmenu(false),
                          2000
                        );
                      }}
                    >
                      <Text style={styles.epTile}>
                        {item.name.split(" ")[1]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          ) : null}
          {showseekinfoR ? (
            <View style={styles.popupseekinfo}>
              <MaterialIcons
                name="forward-10"
                size={scaledSize(30)}
                color="white"
              />
            </View>
          ) : null}
          {showseekinfoL ? (
            <View style={styles.popupseekinfoL}>
              <MaterialIcons
                name="replay-10"
                size={scaledSize(30)}
                color="white"
              />
            </View>
          ) : null}
          <TouchableWithoutFeedback onPress={seekBackwardDoubleTap}>
            <View
              style={{
                width: scaledSize(200),
                height: scaledSize(280),
                borderRadius: scaledSize(100),
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                zIndex: 30,
                left: 0,
                position: "absolute",
                top: scaledSize(70),
              }}
            ></View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={seekForwardDoubleTap}>
            <View
              style={{
                width: scaledSize(200),
                height: scaledSize(280),
                borderRadius: scaledSize(100),
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                zIndex: 30,
                right: 0,
                position: "absolute",
                top: scaledSize(70),
              }}
            ></View>
          </TouchableWithoutFeedback>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{ alignSelf: "center", zIndex: 20 }}
            ></ActivityIndicator>
          ) : showControls ? (
            <TouchableWithoutFeedback
              onPress={() => setShowControls(!showControls)}
            >
              <View style={styles.controlsHolder}>
                <TouchableOpacity
                  style={styles.episodeButton}
                  onPress={() => {
                    setshowepmenu(!showepmenu);
                  }}
                >
                  <Text style={styles.epbuttonTxt}>Episodes</Text>
                </TouchableOpacity>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="white"
                  onPress={async () => {
                    await video.current.unloadAsync();
                    navigation.goBack();
                  }}
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 5,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    borderRadius: 50,
                    width: scaledSize(40),
                    height: scaledSize(40),
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                />
                <View style={styles.titleHolder}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.titleep}>{`Episode no : ${
                    data[currentindex].name.split(" ")[1]
                  }`}</Text>
                </View>
                <View style={styles.centerCotrol}>
                  <MaterialIcons
                    name="replay-10"
                    size={scaledSize(30)}
                    color="white"
                    onPress={() => {
                      if (!status.isBuffering) {
                        video.current.setPositionAsync(
                          status.positionMillis - 10000 < 0
                            ? 0
                            : status.positionMillis - 10000
                        );
                        video.current.playAsync();
                      }
                    }}
                  />
                  <MaterialCommunityIcons
                    name="skip-previous"
                    size={scaledSize(30)}
                    color="white"
                    onPress={() => {
                      setcurrentindex((prev) => prev + 1);
                    }}
                  />
                  {status.isPlaying ? (
                    <FontAwesome5
                      onPress={() => video.current.pauseAsync()}
                      name="pause"
                      size={scaledSize(30)}
                      color="white"
                    />
                  ) : (
                    <FontAwesome5
                      onPress={() => {
                        status.isLoaded
                          ? video.current.playAsync()
                          : ToastAndroid.showWithGravity(
                              "not loaded yet",
                              ToastAndroid.SHORT,
                              ToastAndroid.CENTER
                            );
                      }}
                      name="play"
                      size={scaledSize(30)}
                      color="white"
                    />
                  )}
                  <MaterialCommunityIcons
                    name="skip-next"
                    size={scaledSize(30)}
                    color="white"
                    onPress={() => {
                      setcurrentindex((prev) => prev - 1);
                    }}
                  />
                  <MaterialIcons
                    name="forward-10"
                    size={scaledSize(30)}
                    color="white"
                    onPress={() => {
                      if (!status.isBuffering) {
                        video.current.setPositionAsync(
                          status.positionMillis + 10000
                        );
                        video.current.playAsync();
                      }
                    }}
                  />
                </View>
                <View style={styles.progress}>
                  {status.isLoaded ? (
                    <>
                      <Text style={styles.time}>{currentTime ?? "0"}</Text>
                      <Slider
                        style={{ flex: 1, height: 40 }}
                        value={progress}
                        minimumValue={0}
                        maximumValue={1}
                        onSlidingComplete={(e) => {
                          settime(e);
                          controlRef.current = setTimeout(
                            () => setShowControls(false),
                            2000
                          );
                        }}
                        onSlidingStart={() => {
                          clearTimeout(controlRef.current);
                        }}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#fff"
                      />
                      <Text style={styles.time}>{durationTime ?? "0"}</Text>

                      <SimpleLineIcons
                        name="size-fullscreen"
                        size={scaledSize(16)}
                        style={{
                          marginRight: scaledSize(20),
                          width: scaledSize(40),
                          height: scaledSize(40),
                          textAlign: "center",
                          textAlignVertical: "center",
                        }}
                        onPress={() => {
                          if (strechedMode == "cover")
                            setstrechedMode("contain");
                          else setstrechedMode("cover");
                        }}
                        color="white"
                      />
                    </>
                  ) : (
                    <Text style={styles.time}>{"trying to load..."}</Text>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : null}
          <TouchableWithoutFeedback
            onPress={() => {
              setShowControls(!showControls);
              setshowepmenu(false);
              controlRef.current = setTimeout(
                () => setShowControls(false),
                2000
              );
            }}
          >
            <Video
              source={{
                uri: url,
              }} // Can be a URL or a local file.
              shouldPlay
              ref={video}
              resizeMode={strechedMode}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              style={styles.video}
            />
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
};

export default Play;

const styles = StyleSheet.create({
  popupseekinfo: {
    position: "absolute",
    width: scaledSize(50),
    height: scaledSize(50),
    borderRadius: scaledSize(50),
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 150,
    top: scaledSize(180),
    alignItems: "center",
    justifyContent: "center",
    right: scaledSize(150),
  },
  popupseekinfoL: {
    position: "absolute",
    width: scaledSize(50),
    height: scaledSize(50),
    borderRadius: scaledSize(50),
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 150,
    top: scaledSize(180),
    alignItems: "center",
    justifyContent: "center",
    left: scaledSize(150),
  },
  epbuttonTxt: {
    color: "#d8d8d8",
    fontFamily: "Barlow-Medium",
    height: "100%",
    width: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    paddingBottom: 4,
  },
  episodeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderColor: "rgba(200,200,200,0.5)",
    borderWidth: 1,
    borderRadius: 10,
    width: scaledSize(100),
    height: scaledSize(40),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  serverButton: {
    position: "absolute",
    top: 10,
    right: 150,
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    width: scaledSize(100),
    height: scaledSize(40),
    backgroundColor: "black",
  },
  epContainer: {
    alignItems: "center",
    borderRadius: 20,
  },
  epTile: {
    width: scaledSize(80),
    height: scaledSize(40),
    backgroundColor: "#ffffff",
    margin: scaledSize(4),
    borderRadius: scaledSize(10),
    textAlign: "center",
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(16),
    textAlignVertical: "center",
  },
  episodeMenu: {
    marginTop: scaledSize(400),
    marginLeft: scaledSize(690),
    width: scaledSize(100),
    height: scaledSize(200),
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 20,
    position: "absolute",
    right: 10,
    zIndex: 40,
  },
  time: {
    color: "#fff",
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(14),
    marginHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(20),
  },
  titleep: {
    color: "#fff",
    fontFamily: "Barlow-Medium",
    fontSize: scaledSize(16),
  },
  titleHolder: {
    position: "absolute",
    top: scaledSize(5),
    left: scaledSize(35),
    alignSelf: "center",
    paddingLeft: scaledSize(20),
  },
  progress: {
    position: "absolute",
    bottom: scaledSize(10),
    width: "100%",
    height: scaledSize(15),
    flexDirection: "row",
    alignItems: "center",
  },
  centerCotrol: {
    flexDirection: "row",
    width: "40%",
    justifyContent: "space-evenly",
  },
  controlsHolder: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 16,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
  },
  videoHolder: {
    backgroundColor: "black",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    margin: 0,
    alignSelf: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
