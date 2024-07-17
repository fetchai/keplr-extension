import React, { FunctionComponent, useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";
import { useStyle } from "styles/index";

export const ScannerFrame: FunctionComponent = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const style = useStyle();

  useEffect(() => {
    const animateUpDown = () => {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animateUpDown());
    };

    animateUpDown();
  }, [translateY]);

  return (
    <View style={style.flatten(["justify-center", "items-center"])}>
      <Animated.View
        style={[
          style.flatten(["absolute", "background-color-white"]),
          { width: 218, height: 0.8, transform: [{ translateY }] },
        ]}
      />
      <View style={{ zIndex: -1 }}>
        <Svg width="250" height="220" viewBox="0 0 277 277" fill="none">
          <G clipPath="url(#clip0_2489_3885)">
            <Path
              d="M0.5 19.5V8.5C0.5 4.08172 4.08172 0.5 8.5 0.5H21.5"
              stroke="white"
              strokeWidth="3"
            />
            <Path
              d="M275 19.5V8.5C275 4.08172 271.418 0.5 267 0.5H254"
              stroke="white"
              strokeWidth="3"
            />
            <Path
              d="M0.5 256V267C0.5 271.418 4.08172 275 8.5 275H21.5"
              stroke="white"
              strokeWidth="3"
            />
            <Path
              d="M275 256V267C275 271.418 271.418 275 267 275H254"
              stroke="white"
              strokeWidth="3"
            />
          </G>
          <Rect
            x="0.8"
            y="0.8"
            width="275"
            height="273"
            rx="8"
            stroke="white"
          />
        </Svg>
      </View>
    </View>
  );
};
