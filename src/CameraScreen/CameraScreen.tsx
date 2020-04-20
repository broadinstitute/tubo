import React, {useEffect, useRef, useState} from "react";
import {RNCamera} from "react-native-camera";
import {Camera, CameraCapturedPicture} from "expo-camera";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {askAsync, CAMERA} from "expo-permissions";
import {RouteProp} from "@react-navigation/native";
import {ScreenStack} from "../../App";
import {StackNavigationProp} from "@react-navigation/stack";

type CameraScreenProps = {
  navigation: StackNavigationProp<ScreenStack, 'Camera'>;
  route: RouteProp<ScreenStack, 'Camera'>;
};

export const CameraScreen = ({navigation}: CameraScreenProps) => {
  const ref = useRef<Camera>(null);

  const [permission, setPermission] = useState<boolean | null>(null);
  const [pressed, setPressed] = useState<boolean>(false);
  const [type, setType] = useState<"front" | "back" | undefined>(RNCamera.Constants.Type.back);

  const onPress = () => {
    setPressed(true);
  };

  useEffect(() => {
    const request = async () => {
      const { status } = await askAsync(CAMERA);

      if (status === "granted") {
        setPermission(true);
      }
    };

    request()
      .catch(() => {

      });
  }, []);

  useEffect(() => {
    const capture = async () => {
      if (ref.current) {
        const options = {
          base64: true,
          quality: 0.5
        };

        const photo: CameraCapturedPicture = await ref.current.takePictureAsync(options);

        console.log(photo.uri);

        navigation.navigate('Image', {src: photo});
      }
    };

    capture()
      .catch(() => {

      })
      .then(() => {
        setPressed(false);
      });
  }, [pressed]);

  if (permission === null) {
    return <View />;
  }

  if (!permission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={style.container}>
      <Camera
        ref={ref}
        style={style.preview}
        type={type}
      />

      <View>
        <TouchableOpacity onPress={onPress} style={style.capture}>
          <Text> Snap </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
