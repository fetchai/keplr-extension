import React, { FunctionComponent } from "react";
import FastImage from "react-native-fast-image";
import { VectorCharacter } from "components/vector-character";
import { IconView } from "components/new/button/icon";
import { ViewStyle } from "react-native";
import { useStyle } from "styles/index";

export const TokenSymbol: FunctionComponent<{
  image: string;
  size: number;
  imageScale?: number;
}> = ({ size, image, imageScale = 32 / 44 }) => {
  const style = useStyle();

  return (
    <React.Fragment>
      {image.length > 1 ? (
        <FastImage
          style={{
            width: size * imageScale,
            height: size * imageScale,
          }}
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: image,
          }}
        />
      ) : (
        <IconView
          img={
            <VectorCharacter
              char={image}
              height={Math.floor(size * 0.35)}
              color="white"
            />
          }
          iconStyle={style.flatten(["padding-12"]) as ViewStyle}
        />
      )}
    </React.Fragment>
  );
};
