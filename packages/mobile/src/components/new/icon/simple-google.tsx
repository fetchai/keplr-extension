import React, { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const SimpleGoogleIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size = 10, color = "white" }) => {
  return (
    <Svg
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
      }}
      viewBox="0 0 10 10"
      fill="none"
    >
      <Path
        d="M10 5.12097C10 7.98387 8.01229 10 5.08197 10C2.2541 10 0 7.78226 0 5C0 2.2379 2.2541 0 5.08197 0C6.43443 0 7.60246 0.504032 8.48361 1.31048L7.09016 2.62097C5.28689 0.907258 1.92623 2.19758 1.92623 5C1.92623 6.75403 3.34016 8.16532 5.08197 8.16532C7.09016 8.16532 7.84836 6.75403 7.95082 6.00806H5.08197V4.29435H9.91803C9.95902 4.55645 10 4.79839 10 5.12097Z"
        fill={color}
      />
    </Svg>
  );
};
