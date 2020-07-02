import React, { useEffect, useState } from "react";
import { Camera as ExpoCamera } from "expo-camera";
import { Text, Platform, View } from "react-native";
import { askAsync, CAMERA } from "expo-permissions";
import * as tensorflow from "@tensorflow/tfjs";
import { style } from "./style";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import Svg, { G, Rect, Text as TextSVG } from "react-native-svg";

const C = 152;
const R = 200;

const TensorCamera = cameraWithTensors(ExpoCamera);

type BoundingBox = [number, number, number, number];

const calculateMaxScores = (
  scores: Float32Array,
  numBoxes: number,
  numClasses: number
): [number[], number[]] => {
  const maxes = [];
  const classes = [];

  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE;
    let index = -1;
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j];
        index = j;
      }
    }
    maxes[i] = max;
    classes[i] = index;
  }
  return [maxes, classes];
};

interface Props {
  cameraPermission: boolean;
  setCameraPermission: (permission: boolean) => void;
  setImages: (images: IterableIterator<tensorflow.Tensor3D>) => void;
}

function Camera(props: Props): JSX.Element {
  const { setCameraPermission, setImages } = props;

  /* useEffect(() => { */
  /*   const f = async () => { */
  /*     if (images) { */
  /*       const image = await images.next().value; */
  /*       if (image) { */
  /*         const x = image.expandDims(); */
  /*         if (graph) { */
  /*           const y = (await graph.executeAsync(x)) as tensorflow.Tensor[]; */
  /*           // console.info("y: " + y); */
  /*           if (y) { */
  /*             const categories_shape: number[] = y[0].shape; */
  /*             const geometries_shape: number[] = y[1].shape; */
  /*             const categories = y[0].dataSync() as Float32Array; */
  /*             const geometries = y[1].dataSync() as Float32Array; */
  /*             x.dispose(); */
  /*             tensorflow.dispose(y); */
  /*             // console.info("categories: " + categories); */
  /*             // console.info("geometries: " + geometries); */
  /*             const [scores] = calculateMaxScores( */
  /*               categories, */
  /*               categories_shape[1], */
  /*               categories_shape[2] */
  /*             ); */
  /*             // console.info("scores: " + scores); */
  /*             // console.info("classes: " + classes); */
  /*             const previousBackend = tensorflow.getBackend(); */
  /*             await tensorflow.setBackend("cpu"); */
  /*             const indexTensor = tensorflow.tidy(() => { */
  /*               const boxes2 = tensorflow.tensor2d(geometries, [ */
  /*                 geometries_shape[1], */
  /*                 geometries_shape[3] */
  /*               ]); */
  /*               return tensorflow.image.nonMaxSuppression( */
  /*                 boxes2, */
  /*                 scores, */
  /*                 10, */
  /*                 0.1, */
  /*                 0.1 */
  /*               ); */
  /*             }); */
  /*             const indicies = indexTensor.dataSync() as Float32Array; */
  /*             indexTensor.dispose(); */
  /*             await tensorflow.setBackend(previousBackend); */
  /*             // console.info("indicies:\n" + indicies); */
  /*             const r = x.shape[1]; */
  /*             const c = x.shape[2]; */
  /*             const target: BoundingBox[] = []; */
  /*             for (let i = 0; i < indicies.length; i++) { */
  /*               const box = []; */
  /*               for (let j = 0; j < 4; j++) { */
  /*                 box[j] = geometries[indicies[i] * 4 + j]; */
  /*               } */
  /*               const minY = box[0] * r; */
  /*               const minX = box[1] * c; */
  /*               const maxY = box[2] * r; */
  /*               const maxX = box[3] * c; */
  /*               box[0] = minX; */
  /*               box[1] = minY; */
  /*               box[2] = maxX - minX; */
  /*               box[3] = maxY - minY; */
  /*               target.push(box as BoundingBox); */
  /*             } */
  /*             return target; */
  /*           } */
  /*         } */
  /*       } */
  /*     } */
  /*   }; */

  /*   f() */
  /*     .catch((error) => { */
  /*       console.error(error); */
  /*     }) */
  /*     .then((detections) => { */
  /*       if (detections) { */
  /*         setDetections(detections); */
  /*       } */
  /*     }); */
  /* }); */

  const onReady = (images: IterableIterator<tensorflow.Tensor3D>) => {
    setImages(images);
  };

  useEffect(() => {
    const setup = async () => {
      const { status } = await askAsync(CAMERA);
      console.info({ status });

      setCameraPermission(status === "granted");
    };

    setup().catch((error) => {
      console.info({ error });
    });
  }, []);

  // FIXME: This won't work for different sized phones
  let texture: { r: number; c: number };
  if (Platform.OS === "ios") {
    texture = { r: 1920, c: 1080 };
  } else {
    texture = { r: 1200, c: 1600 };
  }

  // FIXME: No idea why it can't find this type
  /* function setPredictionsCanvas(layout: LayoutRectangle) { */
  // TODO: Set size of SVG predictions canvas to layout measurements
  /* } */

  return (
    <TensorCamera
      autorender
      cameraTextureHeight={texture.r}
      cameraTextureWidth={texture.c}
      onReady={onReady}
      resizeDepth={3}
      resizeHeight={R}
      resizeWidth={C}
      style={style.camera}
      type={ExpoCamera.Constants.Type.back}
    />
  );
}

export default React.memo<Props>(Camera, (prevProps, nextProps) => {
  return prevProps.cameraPermission === nextProps.cameraPermission;
});
