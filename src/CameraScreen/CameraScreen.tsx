import React, {useEffect, useState} from "react";
import {Camera} from "expo-camera";
import {Platform, Text, TouchableOpacity, View} from "react-native";
import {askAsync, CAMERA} from "expo-permissions";
import {RouteProp} from "@react-navigation/native";
import {ScreenStack} from "../App";
import {StackNavigationProp} from "@react-navigation/stack";
import * as tensorflow from '@tensorflow/tfjs';
import {style} from "./CameraScreen.style";
import {cameraWithTensors} from '@tensorflow/tfjs-react-native';
import {DetectedObject} from '@tensorflow-models/coco-ssd';
import {CLASSES} from "@tensorflow-models/coco-ssd/dist/classes";
import Svg, {G, Rect} from "react-native-svg";

type CameraScreenProps = {
  navigation: StackNavigationProp<ScreenStack, 'Camera'>;
  route: RouteProp<ScreenStack, 'Camera'>;
};

const ORIGIN = 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1';

const TensorCamera = cameraWithTensors(Camera);

const config = {

};

const buildDetectedObjects = (width: number, height: number, boxes: Float32Array, scores: number[], indexes: Float32Array, classes: number[]): DetectedObject[] => {
  const count = indexes.length;
  const objects: DetectedObject[] = [];
  for (let i = 0; i < count; i++) {
    const bbox = [];
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indexes[i] * 4 + j];
    }
    const minY = bbox[0] * height;
    const minX = bbox[1] * width;
    const maxY = bbox[2] * height;
    const maxX = bbox[3] * width;
    bbox[0] = minX;
    bbox[1] = minY;
    bbox[2] = maxX - minX;
    bbox[3] = maxY - minY;
    objects.push({
      bbox: bbox as [number, number, number, number],
      class: CLASSES[classes[indexes[i]] + 1].displayName,
      score: scores[indexes[i]]
    });
  }
  return objects;
};

const calculateMaxScores = (scores: Float32Array, numBoxes: number, numClasses: number): [number[], number[]] => {
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

export const CameraScreen = ({navigation}: CameraScreenProps) => {
  const [detections, setDetections] = useState<DetectedObject[]>([]);
  const [graph, setGraph] = useState<tensorflow.GraphModel | null>(null);
  const [images, setImages] = useState<IterableIterator<tensorflow.Tensor3D>>();
  const [permission, setPermission] = useState<boolean | null>(null);
  const [rectangles, setRectangles] = useState<any[]>([]);

  useEffect(() => {
    const rects = detections.map((detection: DetectedObject, index: number) => {
      return <Rect
        fill={'red'}
        fillOpacity={0.2}
        height={(detection.bbox[3] - detection.bbox[1])}
        key={index}
        width={(detection.bbox[2] - detection.bbox[0])}
        x={detection.bbox[0]}
        y={detection.bbox[1]}
      />;
    });

    setRectangles(rects);
  }, [detections]);

  useEffect(() => {
    const f = async () => {
      if (images) {
        const image = await images.next().value;

        if (image) {
          const x = image.expandDims();

          if (graph) {
            const y = await graph.executeAsync(x) as tensorflow.Tensor[];

            // console.info("y: " + y);

            if (y) {
              const categories_shape: number[] = y[0].shape;
              const geometries_shape: number[] = y[1].shape;

              const categories = y[0].dataSync() as Float32Array;
              const geometries = y[1].dataSync() as Float32Array;

              x.dispose();

              tensorflow.dispose(y);

              // console.info("categories: " + categories);
              // console.info("geometries: " + geometries);

              const [scores, classes] = calculateMaxScores(categories, categories_shape[1], categories_shape[2]);

              // console.info("scores: " + scores);
              // console.info("classes: " + classes);

              const previousBackend = tensorflow.getBackend();

              await tensorflow.setBackend("cpu");

              const indexTensor = tensorflow.tidy(() => {
                const boxes2 = tensorflow.tensor2d(geometries, [geometries_shape[1], geometries_shape[3]]);

                return tensorflow.image.nonMaxSuppression(boxes2, scores, 20, 0.1, 0.1);
              });

              const indicies = indexTensor.dataSync() as Float32Array;

              indexTensor.dispose();

              await tensorflow.setBackend(previousBackend);

              // console.info("indicies:\n" + indicies);

              const r = x.shape[1];
              const c = x.shape[2];

              return buildDetectedObjects(c, r, geometries, scores, indicies, classes);
            }
          }
        }
      }
    };

    f()
      .catch((error) => {
        console.error(error);
      })
      .then((detections) => {
        if (detections) {
          setDetections(detections);
        }
      })
  }, [images]);

  const onReady = (images: IterableIterator<tensorflow.Tensor3D>) => {
    setImages(images);
  };

  useEffect(() => {
    const setup = async () => {
      const { status } = await askAsync(CAMERA);

      if (status === "granted") {
        setPermission(true);
      }

      await tensorflow.ready();

      const options = {
        fromTFHub: true,
        onProgress: (fraction: number) => {
          console.info(fraction);
        }
      };

      return await tensorflow.loadGraphModel(ORIGIN, options);
    };

    setup()
      .then((graph) => {
        setGraph(graph);
      })
      .catch((error) => {
        console.error(error)
      });
  }, []);

  let texture: {r: number; c: number;};
  if (Platform.OS === "ios") {
    texture = {r: 1920, c: 1080,};
  } else {
    texture = {r: 1200, c: 1600,};
  }

  if (permission) {
    return (
      <View style={style.container}>
        <TensorCamera
          autorender
          cameraTextureHeight={texture.r}
          cameraTextureWidth={texture.c}
          onReady={onReady}
          resizeDepth={3}
          resizeHeight={224}
          resizeWidth={224}
          style={style.preview}
          type={Camera.Constants.Type.back}
        />

        <View>
          <Svg height='100%' viewBox={`0 0 224 224`} width='100%'>
            <G>
              {rectangles}
            </G>
          </Svg>
        </View>

        <View>
          <TouchableOpacity onPress={() => {}} style={style.capture}>
            <Text>Snap</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};
