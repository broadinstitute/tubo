import * as React from "react";
import { Text } from "react-native";
import * as tensorflow from "@tensorflow/tfjs";
import { askAsync, CAMERA } from "expo-permissions";

type BoundingBox = [number, number, number, number];

interface Props {
  images: IterableIterator<tensorflow.Tensor3D> | undefined;
  graph: tensorflow.GraphModel;
}

function calculateMaxScores(
  scores: Float32Array,
  numBoxes: number,
  numClasses: number
): [number[], number[]] {
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
}

async function findDetections(
  image: tensorflow.Tensor3D,
  graph: tensorflow.GraphModel
) {
  const x = image.expandDims();
  const y = (await graph.executeAsync(x)) as tensorflow.Tensor[];

  const categories_shape: number[] = y[0].shape;
  const geometries_shape: number[] = y[1].shape;
  const categories = y[0].dataSync() as Float32Array;
  const geometries = y[1].dataSync() as Float32Array;

  x.dispose();
  tensorflow.dispose(y);
  // console.info("categories: " + categories);
  // console.info("geometries: " + geometries);

  const [scores] = calculateMaxScores(
    categories,
    categories_shape[1],
    categories_shape[2]
  );
  // console.info("scores: " + scores);
  // console.info("classes: " + classes);

  const previousBackend = tensorflow.getBackend();
  await tensorflow.setBackend("cpu");

  const indexTensor = tensorflow.tidy(() => {
    const boxes2 = tensorflow.tensor2d(geometries, [
      geometries_shape[1],
      geometries_shape[3]
    ]);

    return tensorflow.image.nonMaxSuppression(boxes2, scores, 10, 0.1, 0.1);
  });

  const indicies = indexTensor.dataSync() as Float32Array;
  indexTensor.dispose();
  await tensorflow.setBackend(previousBackend);

  const r = x.shape[1];
  const c = x.shape[2];
  const target: BoundingBox[] = [];

  for (let i = 0; i < indicies.length; i++) {
    const box = [];

    for (let j = 0; j < 4; j++) {
      box[j] = geometries[indicies[i] * 4 + j];
    }

    const minY = box[0] * r;
    const minX = box[1] * c;
    const maxY = box[2] * r;
    const maxX = box[3] * c;

    box[0] = minX;
    box[1] = minY;
    box[2] = maxX - minX;
    box[3] = maxY - minY;

    target.push(box as BoundingBox);
  }

  return target;
}

function useDetections(
  images: IterableIterator<tensorflow.Tensor3D> | undefined,
  graph: tensorflow.GraphModel | null
) {
  React.useMemo(() => {
    if (!graph || !images) return;
    return findDetections(images.next().value, graph);
  }, [images, graph]);
}

export default function Detections(props: Props): JSX.Element {
  const { images, graph } = props;
  /* const detections = useDetections(images, graph); */
  console.info({ graph });

  return <Text>Detections</Text>;
  /* <View */
  /*   style={style.predictions} */
  /*   onLayout={({ nativeEvent }) => */
  /*     setPredictionsCanvas(nativeEvent.layout) */
  /*   } */
  /* > */
  /*   <Svg */
  /*     height="100%" */
  /*     scaleX={scaleX} */
  /*     viewBox={`0 0 ${C} ${R}`} */
  /*     width="100%" */
  /*   > */
  /*     {detections.map((detection, index) => { */
  /*       return ( */
  /*         // TODO: Use a unique key (like stringifying the detection) */
  /*         <G key={index}> */
  /*           <TextSVG x={detection[0]} y={detection[1]}> */
  /*             Score */
  /*           </TextSVG> */
  /*           <Rect */
  /*             fillOpacity={0.0} */
  /*             height={detection[3] - detection[1]} */
  /*             strokeWidth={1} */
  /*             stroke={"blue"} */
  /*             strokeOpacity={1.0} */
  /*             width={detection[2] - detection[0]} */
  /*             x={detection[0]} */
  /*             y={detection[1]} */
  /*           /> */
  /*         </G> */
  /*       ); */
  /*     })} */
  /*   </Svg> */
  /* </View> */
}
