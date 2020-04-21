import {StyleSheet} from "react-native";

export const style = StyleSheet.create({
  capture: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    flex: 0,
    margin: 20,
    padding: 15,
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  predictions: {
    borderColor: 'black',
    borderRadius: 0,
    borderWidth: 1,
    height: 800/2,
    left: 50,
    position:'absolute',
    top: 100,
    width: 600/2,
    zIndex: 20,
  },
});
