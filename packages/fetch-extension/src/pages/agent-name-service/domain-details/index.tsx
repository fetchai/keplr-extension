import React, { useState } from "react";
import { Tab } from "@new-components/tab";
import { useLocation, useNavigate } from "react-router";
import { HeaderLayout } from "../../../new-layouts";
import { Permissions } from "./permissions";
import { Addresses } from "./addresses";

const tabs = [
  { tabName: "permissions", displayName: "Permissions" },
  { tabName: "addresses", displayName: "Addresses" },
];

export const AgentDomainDetails = () => {
  const domainName = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tabs[0].tabName);
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={domainName}
      onBackButton={() => {
        navigate("/agent-name-service");
      }}
      showBottomMenu={true}
    >
      <Tab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "permissions" ? <Permissions /> : <Addresses />}
    </HeaderLayout>
  );
};
