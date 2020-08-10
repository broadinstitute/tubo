import * as React from "react";
import { Text, View } from "react-native";
import tailwind from "tailwind-rn";
import styles from "./styles";

export default function Readout() {
  return (
    <View style={styles.readout}>
      <Text style={tailwind("text-2xl font-extrabold")}>Readout goes here</Text>
    </View>
  );
}
