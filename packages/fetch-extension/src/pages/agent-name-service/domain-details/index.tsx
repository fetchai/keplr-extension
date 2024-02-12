import React, { useState } from "react";
import { Tab } from "@new-components/tab";
import { useLocation, useNavigate } from "react-router";
import { HeaderLayout } from "../../../new-layouts";
import { Permissions } from "./permissions";
import { Addresses } from "./addresses";
import style from "../../fetch-name-service/domain-details/style.module.scss";
import { UpdateOptions } from "./update-options";
import { OptionConfirmationPopup } from "./update-options/option-confirmation-popup";
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
  const [isOptionsPopupOpen, setIsOptionsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
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
      rightRenderer={
        <div onClick={() => setIsOptionsPopupOpen(!isOptionsPopupOpen)}>
          <img
            style={{ height: "20px", cursor: "pointer" }}
            src={require("@assets/svg/three-dots.svg")}
            alt=""
          />
        </div>
      }
    >
      {isTrnsxLoading ? (
        <div className={style["loader"]} style={{ zIndex: 300 }}>
          Loading Transaction
          <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      ) : null}
      <Tab tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      {isOptionsPopupOpen && (
        <UpdateOptions
          setIsOptionsPopupOpen={setIsOptionsPopupOpen}
          setSelectedOption={setSelectedOption}
        />
      )}
      {selectedOption !== "" && (
        <OptionConfirmationPopup
          domain={domainName}
          setIsTrnsxLoading={setIsTrnsxLoading}
          handleCancel={() => setSelectedOption("")}
          selectedOption={selectedOption}
        />
      )}
      {activeTab === "permissions" ? (
        <Permissions setIsTrnsxLoading={setIsTrnsxLoading} tabName={tabName} />
      ) : (
        <Addresses domainName={domainName}  setIsTrnsxLoading={setIsTrnsxLoading}/>
      )}
    </HeaderLayout>
  );
};
