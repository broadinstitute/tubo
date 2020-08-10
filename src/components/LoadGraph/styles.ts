import { StyleSheet } from "react-native";

export default StyleSheet.create({
  loading: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  loadingHeader: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center"
  },
  progressContainer: {
    display: "flex",
    justifyContent: "space-between",
    overflow: "hidden",
    width: "100%"
  },
  progressBar: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 4,
    borderWidth: 2,
    // flex: 1,
    height: 12,
    marginBottom: 4
  },
  progress: {
    backgroundColor: "black",
    height: "100%"
  }
});
