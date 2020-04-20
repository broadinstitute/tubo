import React from "react";
import {CameraScreen} from "../CameraScreen";
import {ImageScreen} from "../ImageScreen";
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export type ScreenStack = {
  Camera: undefined;
  Image: { uri: string }
};

const Stack = createStackNavigator<ScreenStack>();

export const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Image" component={ImageScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
