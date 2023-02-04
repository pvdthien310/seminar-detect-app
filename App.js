import React, { useState, useEffect } from "react";
import { Button, Image, View, Text, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [base64_data, setBase64Data] = useState("");

  const pickImage = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
    setText("");
    setBase64Data("");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "Images",
      base64: true,
    }).then((data) => {
      const temp = new FormData();
      temp.append("image", data.base64);
      setBase64Data(data.base64);

      axios.post("http://192.168.1.50:5000/detectData", temp).then((res) => {
        setText(res.data.result);
      });
    });
  };

  const pickImage2 = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "Images",
      base64: true,
    }).then((data) => {
      const temp = new FormData();
      temp.append("image", data.base64);
      setBase64Data(data.base64);

      axios.post("http://192.168.1.50:5000/detectData1", temp).then((res) => {
        setText(res.data.result);
      });
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button
        title="Pick an image from camera roll test"
        onPress={pickImage2}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Text>{text}</Text>
      <TextInput
        value={base64_data}
        multiline
        style={{ width: 300, height: 200 }}
      ></TextInput>
    </View>
  );
}
