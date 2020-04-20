import React from "react";
import {Image, ImageBackground, StyleSheet, View} from "react-native";
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenStack} from "../../App";
import {RouteProp} from '@react-navigation/native';
import {CameraCapturedPicture} from "expo-camera";

type ImageScreenProps = {
  navigation: StackNavigationProp<ScreenStack, 'Image'>;
  route: RouteProp<ScreenStack, 'Image'>;
  src: CameraCapturedPicture;
};

export const ImageScreen = ({ navigation, route, src }: ImageScreenProps) => {
  return <Image source={{uri: 'https://picsum.photos/256/256' }} style={style.image}/>;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode: "contain",
    justifyContent: "center"
  },
});
    