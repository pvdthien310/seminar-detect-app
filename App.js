import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [base64_data, setBase64Data] = useState("");

  const askForPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      console.log("Camera roll permission not granted");
      return false;
    }
    return true;
  };

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

        axios
          .post("http://192.168.0.103:5000/detectData", temp)
          .then((res) => {
            setText(res.data.result);
          })
          .catch((err) => console.log(err));
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

        axios.post("http://192.168.0.103:5000/detectData", temp).then((res) => {
          setText(res.data.result);
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
      <Text style={styles.titleText}>This is VietOCR test</Text>
      <Text style={styles.subtitleText}>Let's start by these two options!</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={{ color: "white" }}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickFromCameraRoll}>
          <Text style={{ color: "white" }}>Pick an image from camera roll</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F5FCFF",
          }}
        >
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
          <Text>{text}</Text>
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
});
