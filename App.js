import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { URL_Detection } from "./constant";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [base64_data, setBase64Data] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    setText("");
    setBase64Data("");
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
    } else {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "Images",
        base64: true,
      }).then((data) => {
        const temp = new FormData();
        temp.append("image", data.base64);
        setBase64Data(data.base64);
        setLoading(true);
        axios
          .post(URL_Detection, temp)
          .then((res) => {
            setLoading(false);
            setText(res.data.result);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      });
    }
  };

  const pickFromCameraRoll = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    setText("");
    setBase64Data("");
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        base64: true,
      }).then((data) => {
        const temp = new FormData();
        temp.append("image", data.base64);
        setBase64Data(data.base64);
        setLoading(true);
        axios
          .post(URL_Detection, temp)
          .then((res) => {
            setLoading(false);
            setText(res.data.result);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5FCFF",
      }}
    >
      {!loading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5FCFF",
          }}
        >
          <Text style={styles.titleText}>This is VietOCR test</Text>
          <Text style={styles.subtitleText}>
            Let's start by these two options!
          </Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={{ color: "white" }}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={pickFromCameraRoll}
            >
              <Text style={{ color: "white" }}>
                Pick an image from camera roll
              </Text>
            </TouchableOpacity>
          </View>
          {text !== "" ? (
            <View>
              <Text
                style={{
                  margin: 10,
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                }}
              >
                Result:
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={20}
                style={styles.input}
                onChangeText={setText}
                value={text}
              />
              <TouchableOpacity
                onPress={() => setText("")}
                style={styles.button}
              >
                <Text style={{ color: "white", textAlign: "center" }}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5FCFF",
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 3 }}>Waiting for processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  subtitleText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  btnContainer: {
    alignItems: "center",
    margin: 10,
  },
  button: {
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#0D0D0D",
    padding: 10,
  },
  input: {
    minHeight: 40,
    margin: 5,
    borderWidth: 1,
    padding: 5,
    height: "auto",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
