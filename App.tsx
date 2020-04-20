import React from "react";
import {CameraScreen} from "./src";
import {ImageScreen} from "./src";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {CameraCapturedPicture} from "expo-camera";

export type ScreenStack = {
  Camera: undefined;
  Image: { photo: CameraCapturedPicture }
};

const Stack = createStackNavigator<ScreenStack>();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Image" component={ImageScreen} initialParams={{ photo: undefined }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
