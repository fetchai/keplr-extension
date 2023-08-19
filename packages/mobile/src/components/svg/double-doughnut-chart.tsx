import React, { useState, useEffect, FunctionComponent } from "react";
import Svg, { Circle, G } from "react-native-svg";

export const DoubleDoughnutChart: FunctionComponent<{
  size?: number;
  // Only two data are allowed. If it is [0, 0], a gray ring is shown behind. If undefined, nothing is displayed.
  data: [number, number] | undefined;
}> = ({ data, size = 188 }) => {
  const strokeWidth = 14;
  // const centerLocation = 90;
  // const radius = 83;
  const centerLocation = size / 2;
  const radius = centerLocation - strokeWidth / 2;
  const percentage1 = 50;
  const percentage2 = 50;
  const capRadius = centerLocation - radius;

  const firstData = data ? data[0] : 0;
  const secondData = data ? data[1] : 0;

  const [dashArray1, setDashArray1] = useState(`0 ${firstData}`);
  const [dashArray2, setDashArray2] = useState(`0 ${secondData}`);

  useEffect(() => {
    const circumference = 2 * Math.PI * radius;
    const offset1 = ((100 - percentage1) / 100) * circumference;
    const offset2 = ((100 - percentage2) / 100) * circumference;

    setDashArray1(`${offset1} ${circumference}`);
    setDashArray2(`${offset2} ${circumference}`);
  }, [percentage1, percentage2, radius]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`translate(${centerLocation}, ${centerLocation})`}>
        <Circle
          r={radius}
          fill="none"
          stroke="green"
          strokeWidth={strokeWidth}
          strokeOpacity="0.5"
        />
        <Circle
          r={radius}
          fill="none"
          stroke="yellow" // Color for the first doughnut
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray1}
          strokeLinecap="round"
        />
        <Circle
          r={capRadius}
          fill="white"
          stroke="red"
          strokeWidth={strokeWidth}
          strokeOpacity="0.5"
        />
        <Circle
          r={capRadius}
          fill="white"
          stroke="blue" // Color for the second doughnut
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray2}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};
