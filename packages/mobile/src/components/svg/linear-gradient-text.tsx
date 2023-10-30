import React, {FunctionComponent} from "react";
import Svg, {Defs, LinearGradient, Stop, Text as TextSvg} from "react-native-svg";


export const LinearGradientText: FunctionComponent<{
    width?: string;
    height?: string;
    color1?: string;
    color2?: string
    text: string;
}> = ({
          width = "100%",
          height = "30",
          color1 = "#CF447B",
          color2 = "#E7615F",
          text
      }) => {
    return (
        <Svg width={width} height={height}>
            <Defs>
                <LinearGradient
                    id="customGradient"
                    x1="37.86%"
                    y1="0%"
                    x2="78.96%"
                    y2="100%"
                >
                    <Stop offset="0%" stopColor={color1}/>
                    <Stop offset="100%" stopColor={color2}/>
                </LinearGradient>
            </Defs>
            <TextSvg
                x="50%"
                y="100%"
                textAnchor="middle"
                fontSize="32"
                fill="url(#customGradient)"

            >
                {text}
            </TextSvg>
        </Svg>
    );
}