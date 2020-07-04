import React from "react";
import * as tensorflow from "@tensorflow/tfjs";
import { View } from "react-native";

import styles from "./styles";
import Camera from "../Camera";
import Detections from "../Detections";
import LoadGraph from "../LoadGraph";
/* import Readout from "../Readout"; */
/* import Controls from "../Controls"; */

export default function App() {
  const [cameraPermission, setCameraPermission] = React.useState(false);
  const [graph, setGraph] = React.useState<tensorflow.GraphModel>();
  const [images, setImages] = React.useState<
    IterableIterator<tensorflow.Tensor3D>
  >();

  if (!graph) {
    return <LoadGraph setGraph={setGraph} />;
  }

  return (
    <View style={styles.app}>
      <View style={styles.cameraContainer}>
        <Camera
          cameraPermission={cameraPermission}
          setCameraPermission={setCameraPermission}
          setImages={setImages}
        />
        {/* FIXME: Once memory issues are fixed, uncommenting this should work */}
        <Detections images={images} graph={graph} />
      </View>
      {/* <Controls /> */}
    </View>
  );
}
