import { TabsPanel } from "@components-v2/tabs/tabsPanel";
import React, { useState } from "react";
import { LineGraph } from "./line-graph";

interface LineGraphViewProps {
  tokenName: string | undefined;
  setTokenState: any;
}

const tabs = [
  {
    id: "24H",
    duration: 1,
  },
  {
    id: "1W",
    duration: 7,
  },
  {
    id: "1M",
    duration: 30,
  },
  {
    id: "3M",
    duration: 90,
  },
  {
    id: "1Y",
    duration: 360,
  },
  {
    id: "All",
    duration: 0,
  },
];

export const LineGraphView: React.FC<LineGraphViewProps> = ({
  tokenName,
  setTokenState,
}) => {
  const [activeTab, setActiveTab] = useState<any>(tabs[0]);

  return (
    <div>
      <LineGraph
        duration={activeTab.duration}
        tokenName={tokenName}
        setTokenState={setTokenState}
      />
      <TabsPanel
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
