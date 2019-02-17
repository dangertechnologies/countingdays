import React from "react";
import { ImageBackground } from "react-native";

import { BlurView } from "react-native-blur";
import LinearGradient from "react-native-linear-gradient";

import Images from "../Images";
import { TBackground } from "../Store";

interface IBackgroundProps {
  children: React.ReactNode;
  background: TBackground;
}

const Container = (props: IBackgroundProps) =>
  props.background.type === "gradient" ? (
    <LinearGradient colors={props.background.colors} style={{ flex: 1 }}>
      {props.children}
    </LinearGradient>
  ) : (
    <ImageBackground
      source={
        props.background.type === "photo"
          ? props.background.image
          : Images[props.background.image]
      }
      style={{ flex: 1 }}
    >
      <BlurView style={{ flex: 1 }} blurAmount={3} blurType="light">
        {props.children}
      </BlurView>
    </ImageBackground>
  );

export default Container;
