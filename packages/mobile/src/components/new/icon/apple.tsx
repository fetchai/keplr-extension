import React, { FunctionComponent } from "react";
import Svg, { Path, Rect } from "react-native-svg";

export const AppleIcon: FunctionComponent<{
  width?: number | string;
  height?: number | string;
}> = ({ width = 32, height = 20 }) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 32 32">
      <Rect width="32" height="32" rx="16" fill="black" />
      <Path
        d="M19.4453 16.1055C19.4453 16.1602 19.3633 17.7734 21.1406 18.6211C20.8125 19.6328 19.6641 21.875 18.3242 21.875C17.5586 21.875 17.1211 21.3828 16.2461 21.3828C15.3438 21.3828 14.8516 21.875 14.168 21.875C12.8555 21.9297 11.5977 19.4688 11.2422 18.457C10.9688 17.6914 10.8594 16.9531 10.8594 16.2422C10.8594 13.8086 12.4727 12.6328 14.0039 12.6055C14.7422 12.6055 15.6719 13.125 16.082 13.125C16.4648 13.125 17.5312 12.4961 18.5156 12.5781C19.5273 12.6602 20.293 13.043 20.8125 13.7812C19.9102 14.3555 19.4453 15.0938 19.4453 16.1055ZM17.9141 11.6211C17.3672 12.25 16.7109 12.6055 16 12.5508C15.9453 11.8125 16.2188 11.1289 16.7109 10.582C17.1484 10.0898 17.9141 9.67969 18.5703 9.625C18.5703 9.92578 18.6523 10.7461 17.9141 11.6211Z"
        fill="white"
      />
    </Svg>
  );
};
