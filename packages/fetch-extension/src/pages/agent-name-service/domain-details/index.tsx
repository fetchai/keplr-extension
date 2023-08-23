import React, { useState } from "react";
import { Tab } from "@new-components/tab";
import { useLocation, useNavigate } from "react-router";
import { HeaderLayout } from "../../../new-layouts";
import { Permissions } from "./permissions";
import { Addresses } from "./addresses";
import style from "../../fetch-name-service/domain-details/style.module.scss";
const tabs = [
  { tabName: "permissions", displayName: "Permissions" },
  { tabName: "addresses", displayName: "Addresses" },
];

export const AgentDomainDetails = () => {
  const domainName = useLocation().pathname.split("/")[3];
  const tabName = useLocation().pathname.split("/")[4];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tabs[0].tabName);
  const [isTrnsxLoading, setIsTrnsxLoading] = useState(false);
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={domainName}
      onBackButton={() => {
        navigate("/more");
      }}
      showBottomMenu={true}
    >
      {isTrnsxLoading ? (
        <div className={style["loader"]} style={{ zIndex: 300 }}>
          Loading Transaction
          <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      ) : null}
      <Tab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "permissions" ? (
        <Permissions setIsTrnsxLoading={setIsTrnsxLoading} tabName={tabName} />
      ) : (
        <Addresses domainName={domainName} />
      )}
    </HeaderLayout>
  );
};
