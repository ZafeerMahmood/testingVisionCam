import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import * as tf from "@tensorflow/tfjs";
import * as posedetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-react-native";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [model, setModel] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const prepare = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
      await tf.ready();
      const movenetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      };
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig
      );
      setModel(model);
      setReady(true);
      console.log(model);
      console.log("ready");
    };

    prepare();
  }, []);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      try {
        // console.log("frame" + frame);
        console.log(model);
        if (model != null) {
          // const pose = model.estimatePoses(frame, undefined, Date.now());
          // console.log(pose);
        }
      } catch (e) {
        console.log(e);
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
