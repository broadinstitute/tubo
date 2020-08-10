import * as React from "react";
import { Animated, Text, View } from "react-native";
import * as tensorflow from "@tensorflow/tfjs";
import styles from "./styles";

// TODO: Make this an env variable
const ORIGIN =
  "https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1";

interface Props {
  setGraph: (graph: tensorflow.GraphModel) => void;
}

export default function LoadGraph(props: Props): JSX.Element {
  const { setGraph } = props;
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const loadGraph = async () => {
      await tensorflow.ready();

      const options = {
        fromTFHub: true,
        onProgress: (loading: number) => {
          setProgress(Math.round(loading * 100));
        }
      };

      const graph = await tensorflow.loadGraphModel(ORIGIN, options);

      setGraph(graph);
    };

    loadGraph().catch((error) => {
      console.info(`Error!: ${error}`);
    });
  }, []);

  return (
    <View style={styles.loading}>
      <Text style={styles.loadingHeader}>Loading model…</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={{ ...styles.progress, width: `${progress}%` }} />
        </View>
        <Text>{progress}%</Text>
      </View>
    </View>
  );
}
