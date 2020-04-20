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
  src: CameraCapturedPicture;
};

export const ImageScreen = ({ navigation, route, src }: ImageScreenProps) => {
  return <Image source={{uri: 'https://picsum.photos/256/256' }} style={style.image}/>;
};

