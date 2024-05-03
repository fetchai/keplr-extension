import React, { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const ReloadIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size = 19, color = "white" }) => {
  return (
    <Svg
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
      }}
      viewBox="0 0 19 12"
      fill="none"
    >
      <Path
        d="M5.10156 0.773438L7.72656 3.39844C8.08203 3.72656 8.08203 4.30078 7.72656 4.62891C7.39844 4.98438 6.82422 4.98438 6.49609 4.62891L5.375 3.50781V7.5C5.375 7.99219 5.75781 8.375 6.25 8.375H9.3125C9.77734 8.375 10.1875 8.78516 10.1875 9.25C10.1875 9.74219 9.77734 10.125 9.3125 10.125H6.25C4.80078 10.125 3.625 8.94922 3.625 7.5V3.50781L2.47656 4.62891C2.14844 4.98438 1.57422 4.98438 1.24609 4.62891C0.890625 4.30078 0.890625 3.72656 1.24609 3.39844L3.87109 0.773438C4.19922 0.417969 4.77344 0.417969 5.10156 0.773438ZM10.1875 1.375H13.25C14.6992 1.375 15.875 2.55078 15.875 4V8.01953L16.9961 6.89844C17.3242 6.54297 17.8984 6.54297 18.2266 6.89844C18.582 7.22656 18.582 7.80078 18.2266 8.12891L15.6016 10.7539C15.2734 11.1094 14.6992 11.1094 14.3711 10.7539L11.7461 8.12891C11.3906 7.80078 11.3906 7.22656 11.7461 6.89844C12.0742 6.54297 12.6484 6.54297 12.9766 6.89844L14.125 8.01953V4C14.125 3.53516 13.7148 3.125 13.25 3.125H10.1875C9.69531 3.125 9.3125 2.74219 9.3125 2.25C9.3125 1.78516 9.69531 1.375 10.1875 1.375Z"
        fill={color}
      />
    </Svg>
  );
};
