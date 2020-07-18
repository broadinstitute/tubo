import React from "react";
import * as tensorflow from "@tensorflow/tfjs";
import { View } from "react-native";

import styles from "./styles";
import Camera from "components/Camera";
import Detections from "components/Detections";
import LoadGraph from "components/LoadGraph";
import Readout from "components/Readout";
/* import Controls from "components/Controls"; */

export default function App() {
  const [cameraPermission, setCameraPermission] = React.useState(false);
  const [graph, setGraph] = React.useState<tensorflow.GraphModel>();
  const [images, setImages] = React.useState<
    IterableIterator<tensorflow.Tensor3D>
  >();

  /* if (!graph) { */
  /*   return <LoadGraph setGraph={setGraph} />; */
  /* } */

  return (
    <Camera
      cameraPermission={cameraPermission}
      setCameraPermission={setCameraPermission}
      setImages={setImages}
    >
      <View style={styles.app}>
        <View style={styles.cameraContainer}>
          {/* <Detections images={images} graph={graph} /> */}
        </View>
        <Readout />
      </View>
    </Camera>
  );
}
