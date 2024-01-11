import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { TabPanel } from "components/new/tab-panel/tab-panel";
import { LineGraph } from "./line-graph";

const tabs = [
  {
    index: 0,
    id: "24H",
    duration: 1,
  },
  {
    index: 1,
    id: "1W",
    duration: 7,
  },
  {
    index: 2,
    id: "1M",
    duration: 30,
  },
  {
    index: 3,
    id: "3M",
    duration: 90,
  },
  {
    index: 4,
    id: "1Y",
    duration: 360,
  },
  {
    index: 5,
    id: "ALL",
    duration: 0,
  },
];

export const LineGraphView: FunctionComponent<{
  tokenName: string | undefined;
  setTokenState: any;
  tokenState: any;
}> = ({ tokenName, setTokenState, tokenState }) => {
  const [activeTab, setActiveTab] = useState<any>(tabs[0]);
  console.log(tokenState);

  return (
    <View>
      <LineGraph
        duration={activeTab.duration}
        tokenName={tokenName}
        setTokenState={setTokenState}
      />
      <TabPanel tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
    </View>
  );
};
