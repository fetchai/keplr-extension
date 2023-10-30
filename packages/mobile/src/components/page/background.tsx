import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { SimpleGradient } from "../svg";
import { useStyle } from "../../styles";
import { ImageBackground } from "react-native";
import { BlurView } from "@react-native-community/blur";

export type BackgroundMode = "image" | "gradient" | "secondary" | "tertiary" | null;

export const ScreenBackground: FunctionComponent<{
  backgroundMode: BackgroundMode;
  backgroundBlur?:boolean
}> = ({ backgroundMode, backgroundBlur=false }) => {
  const style = useStyle();

  function _decideView(): React.ReactElement<any, any> | null {
    switch (backgroundMode) {
      case "gradient":
        return (
          <SimpleGradient
            degree={style.get("background-gradient").degree}
            stops={style.get("background-gradient").stops}
            fallbackAndroidImage={
              style.get("background-gradient").fallbackAndroidImage
            }
          />
        );
      
      case "secondary":
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: style.get("color-background-secondary").color,
            }}
          />
        );
      
      case "image":
        return (
          <ImageBackground
            source={require("../../assets/image/bg.png")}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
            }}
            >
              {backgroundBlur? 
              <BlurView 
            blurAmount={20}
            style={
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              }
            }
            />:null}
            </ImageBackground>
        );
      
      // case "blurImage":
      //   return (
      //     <ImageBackground
      //       source={require("../../assets/image/bg.png")}
      //       resizeMode="cover"
      //       style={{
      //         width: "100%",
      //         height: "100%",
      //       }}
            
      //       >
      //         <BlurView 
      //       blurAmount={20}
      //       style={
      //         {
      //           position: "absolute",
      //           top: 0,
      //           bottom: 0,
      //           left: 0,
      //           right: 0,
      //         }
      //       }
      //       />
      //       </ImageBackground>
        // );

      default:
        return (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: style.get("color-background-tertiary").color,
            }}
          />
        );
    }
  }

  return backgroundMode ? (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -100,
        bottom: -100,
      }}
    >
        {_decideView()}
    </View>
  ) : null;
};
