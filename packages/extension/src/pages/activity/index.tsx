import { HeaderLayout } from "@layouts/index";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { GovProposalsTab } from "./gov-proposals";
import { LatestBlock } from "./latest-block";
import { NativeTab } from "./native";
import style from "./style.module.scss";
import { Menu } from "../main/menu";

export const ActivityPage: FunctionComponent = observer(() => {
  const intl = useIntl();
  const [latestBlock, setLatestBlock] = useState();
  const [activeTab, setActiveTab] = useState("native");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      menuRenderer={<Menu />}
      alternativeTitle={intl.formatMessage({
        id: "main.menu.activity",
      })}
    >
      <div className={style.container}>
        <div className={style.title}>
          <FormattedMessage id="main.menu.activity" />
          <LatestBlock
            latestBlock={latestBlock}
            setLatestBlock={setLatestBlock}
          />
        </div>
        <div className={style.tabContainer}>
          <div
            className={`${style.tab} ${
              activeTab === "native" ? style.active : ""
            }`}
            onClick={() => handleTabClick("native")}
          >
            Transactions
          </div>
          <div
            className={`${style.tab} ${
              activeTab === "gov" ? style.active : ""
            }`}
            onClick={() => handleTabClick("gov")}
          >
            Gov Proposals
          </div>
        </div>
        {activeTab === "native" && <NativeTab latestBlock={latestBlock} />}
        {activeTab === "gov" && <GovProposalsTab latestBlock={latestBlock} />}
      </div>
    </HeaderLayout>
  );
});
