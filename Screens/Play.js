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
const Play = ({ navigation, route }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [id, setId] = useState(route.params.id);
  const [ep, setEp] = useState(route.params.ep);
  const [image, setImage] = useState(route.params.image);
  const [title, settitle] = useState(route.params.title);
  const [loading, setLoading] = useState(true);
  const [dataLinks, setdataLinks] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [url, setUrl] = useState("");
  const [currentTime, setcurrrentTime] = useState(0);
  const [durationTime, setdurationTime] = useState(0);
  const [totalep, settotalep] = useState(route.params.totalep);
  const [showepmenu, setshowepmenu] = useState(false);
  const [serverlink, setsetverlink] = useState("");
  const [showLinksMenu, setshowLinksMenu] = useState(false);
  const [strechedMode, setstrechedMode] = useState("contain");
  const timer = useRef(null);
  const lefttimer = useRef(null);
  const [t, st] = useState(0);
  const [backtime, setbacktime] = useState(0);
  const [showseekinfoR, setshowseekinfoR] = useState(false);
  const [showseekinfoL, setshowseekinfoL] = useState(false);
  // to hide statusbar
  useEffect(() => {
    StatusBar.setHidden(true);
    navigation.setOptions({ headerShown: false });
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (id === undefined || ep === undefined) return;
      setLoading(true);
      xx();
      async function xx() {
        axios
          .get(`https://animyserver.herokuapp.com/api/watching/${id}/${ep}`)
          .then((res) => {
            setdataLinks(res.data.links);
            if (res.data.links.length >= 1 || res.data.link.length >= 2) {
              if (res.data.links.length === 0) {
                setUrl(res.data.link);
              } else {
                setUrl(res.data.links[0].link);
              }
              setLoading(false);
            } else {
              console.log("err");
            }
          })
          .catch((err) => {
            console.log("err");
          });
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);
  async function skip(e) {
    setLoading(true);
    setshowepmenu(false);
    axios
      .get(`https://animyserver.herokuapp.com/api/watching/${id}/${e}`)
      .then((res) => {
        setsetverlink(res.data.link);
        setdataLinks(res.data.links);
        if (res.data.links.length >= 1 || res.data.link.length >= 2) {
          if (res.data.links.length === 0) {
            setUrl(res.data.link);
          } else {
            setUrl(res.data.links[0].link);
          }
          setLoading(false);
        } else {
          console.log("err");
        }
      })
      .catch((err) => {
        console.log("err");
      });
  }
  async function loadlink(link) {
    setUrl(link);
  }
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
      skip(Number(ep) + 1);
      setEp(Number(ep) + 1);
    }
  }, [status]);
  //changing time of video using slider
  function settime(e) {
    let x = e * status.durationMillis;
    video.current.setPositionAsync(x);
  }
  //generating episode array
  const epList = () => {
    let L = [];
    for (var i = totalep, k = 0; i >= 1; i--, k++) {
      L[k] = i;
    }
    return L;
  };
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
    if (showControls === true) {
      setTimeout(() => setShowControls(false), 2000);
    }
  }, [showControls]);

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
          animeId: id,
          currentEpisode: ep,
          totalEpisodes: totalep,
          animeName: title,
          time: status.positionMillis,
          image: image,
        });
      } else if (prevArray.some((e) => e.animeId === id)) {
        const index = prevArray.findIndex((e) => e.animeId === id);
        let x = prevArray[index].image;
        prevArray[index] = {
          animeId: id,
          currentEpisode: ep,
          totalEpisodes: totalep,
          animeName: title,
          time: status.positionMillis,
          image: x,
        };
      } else {
        prevArray.push({
          animeId: id,
          currentEpisode: ep,
          totalEpisodes: totalep,
          animeName: title,
          time: status.positionMillis,
          image: image,
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
                {epList().map((item) => {
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        skip(item);
                        setEp(item);
                      }}
                    >
                      <Text style={styles.epTile}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          ) : null}
          {showControls && showLinksMenu ? (
            <SafeAreaView style={styles.episodeMenu}>
              <ScrollView contentContainerStyle={styles.epContainer}>
                {dataLinks.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        video.current.loadAsync(item.link);
                      }}
                    >
                      <Text style={styles.epTile}>
                        {item.name.replace(/(|)|-|mp4/g, "")}
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
                    setTimeout(() => setshowepmenu(false), 5000);
                  }}
                >
                  <Text style={styles.epbuttonTxt}>Episodes</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={styles.serverButton}
                  onPress={() => setshowLinksMenu(!showLinksMenu)}
                >
                  <Text style={styles.epbuttonTxt}>Change server</Text>
                </TouchableOpacity> */}
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="white"
                  onPress={() => navigation.goBack()}
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
                  <Text style={styles.titleep}>{`Episode no : ${ep}`}</Text>
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
                      let x = (Number(ep) - 1) % totalep;
                      skip(x);
                      setEp(x);
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
                      let x = Number(ep) + 1;
                      skip(x);
                      setEp(x);
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
                        onSlidingComplete={(e) => settime(e)}
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
