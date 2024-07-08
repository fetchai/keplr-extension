import React, { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const SignOutIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size = 12, color = "white" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 15 13"
      style={{
        width: size,
        height: size,
      }}
      fill="none"
    >
      <Path
        d="M13.8086 7.21484L10.3086 10.7148C10.0352 10.9883 9.625 10.9883 9.37891 10.7148C9.10547 10.4688 9.10547 10.0586 9.37891 9.78516L11.7578 7.40625H5.03125C4.64844 7.40625 4.375 7.13281 4.375 6.75C4.375 6.39453 4.64844 6.09375 5.03125 6.09375H11.7578L9.37891 3.71484C9.10547 3.46875 9.10547 3.05859 9.37891 2.78516C9.625 2.53906 10.0352 2.53906 10.3086 2.78516L13.8086 6.3125C14.0547 6.55859 14.0547 6.96875 13.8086 7.21484ZM4.59375 1.9375H2.40625C1.77734 1.9375 1.3125 2.42969 1.3125 3.03125V10.4688C1.3125 11.0977 1.77734 11.5625 2.40625 11.5625H4.59375C4.94922 11.5625 5.25 11.8633 5.25 12.2188C5.25 12.6016 4.94922 12.875 4.59375 12.875H2.40625C1.06641 12.875 0 11.8086 0 10.4688V3.03125C0 1.71875 1.06641 0.625 2.40625 0.625H4.59375C4.94922 0.625 5.25 0.925781 5.25 1.28125C5.25 1.66406 4.94922 1.9375 4.59375 1.9375Z"
        fill={color}
      />
    </Svg>
  );
};
