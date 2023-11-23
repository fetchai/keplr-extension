import React, { useState } from "react";
import style from "./style.module.scss";

interface Tab {
  id: string;
  component?: any;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
}

export const TabsPanel: React.FC<TabsProps> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <div className={style["tab-container"]}>
      <div className={style["tab-bar"]}>
        {tabs.map((tab) => (
          <button
            className={style["tab"]}
            style={{
              color: `${tab.id !== selectedTab ? "#ffff" : "#000d3d"}`,
              background: `${tab.id === selectedTab ? "white" : "transparent"}`,
              border: `${tab.id === selectedTab ? "white" : "transparent"}`,
              borderRadius: `${tab.id === selectedTab ? "10px" : "0px"}`,
            }}
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled || false}
          >
            {tab.id}
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{ display: tab.id === selectedTab ? "block" : "none" }}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};
