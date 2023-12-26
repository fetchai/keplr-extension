import React from "react";
import style from "./style.module.scss";

export interface TabsProps {
  tabs: any[];
  activeTab: any;
  setActiveTab: any;
}

export const TabsPanel: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <div className={style["tab-container"]}>
      <div className={style["tab-bar"]}>
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTab.id;
          return (
            <button
              className={`${style["tab"]} ${
                tab.id === activeTab.id ? style["selected"] : ""
              }`}
              style={{
                color: `${isSelected ? "#FFF" : "#FFF"}`,
                background: `${
                  isSelected ? "rgba(255,255,255,0.1)" : "transparent"
                }`,
                border: `${
                  isSelected ||
                  tabs.indexOf(tab) === 0 ||
                  tabs.indexOf(tab) === tabs.length - 1
                    ? "transparent"
                    : "white"
                }`,
                borderRadius: `${isSelected ? "100px" : "0px"}`,
              }}
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              disabled={tab.disabled || false}
            >
              {tab.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
