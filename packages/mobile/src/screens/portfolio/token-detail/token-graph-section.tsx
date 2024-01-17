import React, { FunctionComponent, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStyle } from "styles/index";
import { Text, View, ViewStyle } from "react-native";
import { LineGraphView } from "components/new/line-graph";
import { useStore } from "stores/index";

export const TokenGraphSection: FunctionComponent<{
  totalNumber: string;
  totalDenom: string;
}> = observer(({ totalNumber, totalDenom }) => {
  const style = useStyle();
  const { chainStore } = useStore();

  const [tokenState, setTokenState] = useState({
    diff: 0,
    time: "TODAY",
    type: "positive",
  });

  const changeInDollarsValue =
    tokenState.type === "positive"
      ? (parseFloat(totalNumber) * tokenState.diff) / 100
      : -(parseFloat(totalNumber) * tokenState.diff) / 100;

  return (
    <React.Fragment>
      {tokenState ? (
        <View
          style={style.flatten(["flex-row", "justify-center"]) as ViewStyle}
        >
          <Text
            style={
              style.flatten(
                ["color-orange-400", "text-caption2"],
                [tokenState.type === "positive" && "color-green-500"]
              ) as ViewStyle
            }
          >
            {changeInDollarsValue.toFixed(4)} {totalDenom}(
            {tokenState.type === "positive" ? "+" : "-"}
            {tokenState.diff.toFixed(2)})
          </Text>
          <Text style={style.flatten(["color-gray-300", "h7"]) as ViewStyle}>
            {`  ${tokenState.time}`}
          </Text>
        </View>
      ) : null}
      <LineGraphView
        setTokenState={setTokenState}
        tokenName={chainStore.current.feeCurrencies[0].coinGeckoId}
      />
    </React.Fragment>
  );
});
