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
} from "react-native";
import Slider from "@react-native-community/slider";
import * as Progress from "react-native-progress";
import {
  FontAwesome5,
  Entyp,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { Video, AVPlaybackStatus } from "expo-av";
import axios from "react-native-axios";
import { scaledSize } from "./Home";
const Play = ({ navigation, route }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [id, setId] = useState(route.params.id);
  const [ep, setEp] = useState(route.params.ep);
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
  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);
  useEffect(() => {
    if (id === undefined || ep === undefined) return;
    setLoading(true);
    xx();
    async function xx() {
      axios
        .get(`https://animyserver.herokuapp.com/api/watching/${id}/${ep}`)
        .then((res) => {
          console.log("ee");
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
  }, [id]);
  async function skip(e) {
    setLoading(true);
    setshowepmenu(false);
    axios
      .get(`https://animyserver.herokuapp.com/api/watching/${id}/${e}`)
      .then((res) => {
        console.log("ee" + res.data.links);
        setsetverlink(res.data.link);
        setdataLinks(res.data.links);
        if (res.data.links.length >= 1 || res.data.link.length >= 2) {
          if (res.data.links.length === 0) {
            setUrl(res.data.link);
            console.log(res.data.link);
          } else {
            setUrl(res.data.links[0].link);
            console.log(res.data.links[0].link);
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

  function settime(e) {
    let x = e * status.durationMillis;
    video.current.setPositionAsync(x);
  }
  const epList = () => {
    let L = [];
    for (var i = totalep, k = 0; i >= 1; i--, k++) {
      L[k] = i;
    }
    return L;
  };
  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator
          color="white"
          style={{ marginTop: scaledSize(400) }}
        ></ActivityIndicator>
      ) : (
        <View style={styles.videoHolder}>
          {showControls && showepmenu ? (
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
                        console.log(item.link);
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
                  onPress={() => setshowepmenu(!showepmenu)}
                >
                  <Text style={styles.epbuttonTxt}>Episodes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.serverButton}
                  onPress={() => setshowLinksMenu(!showLinksMenu)}
                >
                  <Text style={styles.epbuttonTxt}>Change server</Text>
                </TouchableOpacity>
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
                  />
                  <MaterialCommunityIcons
                    name="skip-previous"
                    size={scaledSize(30)}
                    color="white"
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
                      video.current.setPositionAsync(
                        status.positionMillis + 10000
                      );
                      video.current.playAsync();
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
                    </>
                  ) : (
                    <Text style={styles.time}>{"trying to load..."}</Text>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : null}
          <TouchableWithoutFeedback
            onPress={() => setShowControls(!showControls)}
          >
            <Video
              source={{
                uri: url,
              }} // Can be a URL or a local file.
              shouldPlay
              ref={video}
              resizeMode="cover"
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
  epbuttonTxt: {
    color: "white",
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
    borderColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    width: scaledSize(100),
    height: scaledSize(40),
    backgroundColor: "black",
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
    zIndex: 30,
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
    width: Dimensions.get("window").height,
    height: Dimensions.get("window").width,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
  },
  videoHolder: {
    width: Dimensions.get("window").height,
    height: "100%",
    backgroundColor: "black",
    transform: [{ rotateZ: "90deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    padding: 0,
    margin: 0,
  },
  video: {
    width: Dimensions.get("window").height,
    height: Dimensions.get("window").width,
    position: "absolute",
    bottom: 0,
    zIndex: 6,
    resizeMode: "cover",
  },
});
