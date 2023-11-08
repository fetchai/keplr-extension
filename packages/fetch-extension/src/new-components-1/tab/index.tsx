import React from "react";

interface TabProps {
  tabNames: string[];
  activeTab: string;
  onTabClick: (title: string) => void;
}

export const Tab: React.FC<TabProps> = ({ tabNames, activeTab, onTabClick }) => {
  const handleTabClick = (title: string) => {
    onTabClick(title);
  };

  return (
    <div style={{ display: "flex", cursor: "pointer" }} >
      {tabNames.map((tab, index) => (
        <div
          style={{ background: `${activeTab === tab ? "#ffffff33": "transparent"}`, borderRadius: "8px" }}
          key={index}
          onClick={() => handleTabClick(tab)}
          className={`px-2 py-1 text-white`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tab;
