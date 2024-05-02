import React, { FunctionComponent } from "react";
import Svg, { Path } from "react-native-svg";

export const UnstakedIcon: FunctionComponent<{
  size?: number;
  color?: string;
}> = ({ size = 24, color = "white" }) => {
  return (
    <Svg
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
      }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M7.94531 6.5H9C10.9453 6.5 12.5625 8.11719 12.5625 10.0625V12.5C12.5625 12.8281 12.3047 13.0625 12 13.0625C11.6719 13.0625 11.4375 12.8281 11.4375 12.5V10.625H10.4062C8.57812 10.625 7.125 9.17188 7.125 7.34375C7.125 6.875 7.5 6.5 7.94531 6.5ZM9 7.625H8.25C8.39062 8.70312 9.30469 9.5 10.4062 9.5H11.3672C11.1094 8.44531 10.1484 7.625 9 7.625ZM9.11719 14.9141L7.24219 16.1562C7.14844 16.2266 7.03125 16.25 6.9375 16.25H5.8125C5.48438 16.25 5.25 16.0156 5.25 15.6875C5.25 15.3828 5.48438 15.125 5.8125 15.125H6.75L8.48438 13.9766C8.83594 13.7656 9.23438 13.625 9.63281 13.625H13.3125C14.1328 13.625 14.8125 14.3047 14.8125 15.125C14.8125 15.1484 14.8125 15.1719 14.8125 15.1719L16.3125 14.2344C16.5703 14.0938 16.8516 14 17.1562 14H17.3203C18.1172 14 18.75 14.6328 18.75 15.4297C18.75 15.8984 18.4922 16.3438 18.0938 16.6016L15.8438 18.0547C15.3984 18.3594 14.8594 18.5 14.3203 18.5H5.8125C5.48438 18.5 5.25 18.2656 5.25 17.9375C5.25 17.6328 5.48438 17.375 5.8125 17.375H14.3203C14.6484 17.375 14.9766 17.2812 15.2344 17.1172L17.4844 15.6641C17.5781 15.6172 17.625 15.5234 17.625 15.4297C17.625 15.2656 17.4844 15.125 17.3203 15.125H17.1562C17.0625 15.125 16.9922 15.1484 16.9219 15.1953L14.7188 16.5547C14.625 16.6016 14.5312 16.625 14.4375 16.625H13.3125H12.75H11.25C10.9219 16.625 10.6875 16.3906 10.6875 16.0625C10.6875 15.7578 10.9219 15.5 11.25 15.5H12.75H13.3125C13.5 15.5 13.6875 15.3359 13.6875 15.125C13.6875 14.9375 13.5 14.75 13.3125 14.75H9.63281C9.44531 14.75 9.25781 14.8203 9.11719 14.9141ZM13.5703 10.625H13.3125V10.0625C13.3125 9.875 13.2891 9.6875 13.2656 9.5H13.5703C14.6719 9.5 15.5859 8.70312 15.7266 7.625H15C14.2031 7.625 13.5 8.02344 13.0547 8.60938C12.9141 8.21094 12.7266 7.85938 12.4922 7.53125C13.125 6.89844 14.0156 6.5 15 6.5H16.0312C16.5 6.5 16.875 6.875 16.875 7.34375C16.875 9.17188 15.3984 10.625 13.5703 10.625Z"
        fill={color}
      />
    </Svg>
  );
};
