import React, { FunctionComponent, useState } from "react";
// import Animated from "react-native-reanimated";

// export type ModalTransition = {
//   clock: Animated.Clock;
//   startY: Animated.Value<number>;

//   translateY: Animated.Value<number>;
//   finished: Animated.Value<number>;
//   time: Animated.Value<number>;
//   frameTime: Animated.Value<number>;

//   // If modal is open, set 1,
//   // else, set -1.
//   isOpen: Animated.Value<number>;
//   isInitialized: Animated.Value<number>;
//   isPaused: Animated.Value<number>;

//   // Used as local variable
//   duration: Animated.Value<number>;
//   durationSetOnExternal: Animated.Value<number>;
// };

export const ModalTransisionContext = React.createContext<any | null>(null);

export const ModalTransisionProvider: FunctionComponent = ({ children }) => {
  const [state] = useState({});

  return (
    <ModalTransisionContext.Provider value={state}>
      {children}
    </ModalTransisionContext.Provider>
  );
};

export const useModalTransision = () => {
  const context = React.useContext(ModalTransisionContext);
  if (!context) {
    throw new Error("Can't find ModalTransisionContext");
  }
  return context;
};
