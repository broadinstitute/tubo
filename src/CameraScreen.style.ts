import { StyleSheet } from "react-native";

export const cameraScreenStyle = StyleSheet.create({
  app: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  },
  capture: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 0,
    paddingHorizontal: 20
  },
  camera: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
  cameraContainer: {
    display: "flex",
    height: "50%",
    width: "100%"
  },
  controls: {
    padding: 24
  },
  header: {
    color: "black",
    fontSize: 42,
    fontWeight: "900"
  },
  preview: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  predictions: {
    height: "100%",
    width: "100%",
    zIndex: 19
  }
});
