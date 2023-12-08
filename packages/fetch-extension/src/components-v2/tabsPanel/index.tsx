import React, { useState } from "react";
import style from "./style.module.scss";

interface Tab {
  id: string;
  component?: any;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  showTabsOnBottom?: boolean;
}

export const TabsPanel: React.FC<TabsProps> = ({ tabs, showTabsOnBottom }) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(tabs[0].id);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <div className={style["tab-container"]}>
      {!showTabsOnBottom && (
        <div className={style["tab-bar"]}>
          {tabs.map((tab) => (
            <button
              className={style["tab"]}
              style={{
                color: `${tab.id === selectedTab ? "#FFF" : "#FFF"}`,
                background: `${
                  tab.id === selectedTab
                    ? "rgba(255,255,255,0.1)"
                    : "transparent"
                }`,
                border: `${tab.id === selectedTab ? "white" : "transparent"}`,
                borderRadius: `${tab.id === selectedTab ? "100px" : "0px"}`,
              }}
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled || false}
            >
              {tab.id}
            </button>
          ))}
        </div>
      )}
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: tab.id === selectedTab ? "block" : "none",
              marginBottom: showTabsOnBottom ? "20px" : "0px",
            }}
          >
            {tab.component}
          </div>
        ))}
      </div>
      {showTabsOnBottom && (
        <div className={style["tab-bar"]}>
          {tabs.map((tab) => (
            <button
              className={style["tab"]}
              style={{
                color: `${tab.id === selectedTab ? "#FFF" : "#FFF"}`,
                background: `${
                  tab.id === selectedTab
                    ? "rgba(255,255,255,0.1)"
                    : "transparent"
                }`,
                border: `${tab.id === selectedTab ? "white" : "transparent"}`,
                borderRadius: `${tab.id === selectedTab ? "100px" : "0px"}`,
              }}
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled || false}
            >
              {tab.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
