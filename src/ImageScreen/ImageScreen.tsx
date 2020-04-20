import React from "react";
import {Image} from "react-native";
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenStack} from "../App";
import {RouteProp} from '@react-navigation/native';
import {CameraCapturedPicture} from "expo-camera";
import {style} from "./ImageScreen.style";

type ImageScreenProps = {
  navigation: StackNavigationProp<ScreenStack, 'Image'>;
  route: RouteProp<ScreenStack, 'Image'>;
};

export const ImageScreen = ({ route }: ImageScreenProps) => {
  const { uri } = route.params;

  return <Image source={{uri: uri }} style={style.image}/>;
};
