import React, { FunctionComponent } from "react";
import { WebpageScreen } from "../components/webpage-screen";
import { RouteProp, useRoute } from "@react-navigation/native";

export const WebViewScreen: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          title: string;
          url: string;
        }
      >,
      any
    >
  >();

  const title = route.params.title;
  const url = route.params.url;

  return (
    <WebpageScreen name={title} source={{ uri: url }} originWhitelist={[url]} />
  );
};
