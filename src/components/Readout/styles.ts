import { StyleSheet } from "react-native";
import tailwind from "tailwind-rn";

export default StyleSheet.create({
  readout: {
    ...tailwind(`
      absolute
      bg-white
      bottom-0
      left-0
      p-4
      right-0
    `),
    height: "35%"
  }
});
