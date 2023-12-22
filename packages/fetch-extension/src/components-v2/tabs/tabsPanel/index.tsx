import React, { useState, useEffect } from "react";
import style from "./style.module.scss";

interface Tab {
  id: string;
  component?: any;
  disabled?: boolean;
  isActive?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  showTabsOnBottom?: boolean;
  setActiveTab?: any;
  onTabChange?: any;
}

export const TabsPanel: React.FC<TabsProps> = ({
  tabs,
  showTabsOnBottom,
  setActiveTab,
  onTabChange,
}) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(tabs[0].id);

  useEffect(() => {
    if (setActiveTab) {
      setActiveTab(selectedTab);
    }
    if (onTabChange) {
      onTabChange(selectedTab);
    }
  }, [selectedTab, setActiveTab, onTabChange]);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  return (
    <div className={style["tab-container"]}>
      {!showTabsOnBottom && (
        <div className={style["tab-bar"]}>
          {tabs.map((tab) => (
            <button
              className={`${style["tab"]} ${
                tab.id === selectedTab ? style["selected"] : ""
              }`}
              style={{
                color: `${tab.id === selectedTab ? "#FFF" : "#FFF"}`,
                background: `${
                  tab.id === selectedTab
                    ? "rgba(255,255,255,0.1)"
                    : "transparent"
                }`,
                border: `${
                  tab.id === selectedTab ||
                  tabs.indexOf(tab) === 0 ||
                  tabs.indexOf(tab) === tabs.length - 1
                    ? "transparent"
                    : "white"
                }`,
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
          {tabs.map((tab, index) => (
            <div key={tab.id} className={style["tab-wrapper"]}>
              <button
                className={`${style["tab"]} ${
                  tab.id === selectedTab ? style["selected"] : ""
                }`}
                style={{
                  color: `${tab.id === selectedTab ? "#FFF" : "#FFF"}`,
                  background: `${
                    tab.id === selectedTab
                      ? "rgba(255,255,255,0.1)"
                      : "transparent"
                  }`,
                  border: `${
                    tab.id === selectedTab ||
                    tabs.indexOf(tab) === 0 ||
                    tabs.indexOf(tab) === tabs.length - 1
                      ? "transparent"
                      : "white"
                  }`,
                  borderRadius: `${tab.id === selectedTab ? "100px" : "0px"}`,
                }}
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled || false}
              >
                {tab.id}
              </button>
              {index !== tabs.length - 1 && <div className={style["border"]} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
