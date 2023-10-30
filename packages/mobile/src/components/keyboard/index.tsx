import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";
import Animated from "react-native-reanimated";

export const KeyboardSpacerView = () => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }
    // let event1 = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const event2 = Keyboard.addListener("keyboardDidShow", keyboardWillShow);
    const event3 = Keyboard.addListener("keyboardWillHide", keyboardWillHide);

    return () => {
      // Keyboard.removeSubscription(event1);
      Keyboard.removeSubscription(event2);
      Keyboard.removeSubscription(event3);
    };
  }, []);

  const keyboardWillShow = (event: KeyboardEvent) => {
    setHeight(event.endCoordinates.height);
  };

  const keyboardWillHide = (_: KeyboardEvent) => {
    setHeight(0);
  };

  return (
    <Animated.View
      style={[
        {
          height: height,
        },
      ]}
    />
  );
};
