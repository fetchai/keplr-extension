import React, { useState } from "react";
import style from "./style.module.scss";

export const TabsPanel = ({ tabs }:any) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].id);

  const handleTabClick = (tabId:any) => {
    setSelectedTab(tabId);
  };

  return (
    <div className={style["tab-container"]}>
      <div className={style["tab-bar"]}>
        {tabs.map((tab:any) => (
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
        {tabs.map((tab:any) => (
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
