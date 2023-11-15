import React from "react";
import style from "./style.module.scss"
import { Button } from "reactstrap";
import { useStore } from "../../stores";
interface TabProps {
  tabNames: string[];
  activeTab: string;
  onTabClick: (title: string) => void;
}

export const Tab: React.FC<TabProps> = ({
  tabNames,
  activeTab,
  onTabClick,
}) => {
  const handleTabClick = (title: string) => {
    onTabClick(title);
  };
  const { chainStore } = useStore()
  const isEvm = chainStore.current.features?.includes("evm") ?? false;

  return (
    <div className={style["tab-container"]}>
      {tabNames.map((tab, index) => (
        <Button
          disabled={isEvm && (tab === "Available" || tab === "Staked")}
          style={{
            boxShadow: "none",
            color: `${activeTab !== tab ? "#ffff" : "#000d3d"}`,
            borderRadius: "100px",
            background: `${activeTab === tab ? "white" : "transparent"}`,
            border: `${activeTab === tab ? "white" : "transparent"}`,

          }}
          key={index}
          onClick={() => handleTabClick(tab)}
          className={`${activeTab === tab ? "m-0 px-3 py-1 bg-white" : "m-0 px-3 py-1 text-white"}`}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};
