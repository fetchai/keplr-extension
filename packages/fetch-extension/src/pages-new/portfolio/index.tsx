import { HeaderLayout } from "@layouts-v2/header-layout";
import React from "react";
import { useNavigate } from "react-router";
import style from "./style.module.scss";
import { TabsPanel } from "@components-v2/tabsPanel";
import { TokensView } from "../main/tokens";

export const Portfolio = () => {
  const navigate = useNavigate();
  const tabs = [
    { id: "Tokens", component: <TokensView /> },
    // { id: "NFTs", disabled: true },
    { id: ".FET Domains", disabled: true },
  ];
  return (
    <HeaderLayout
      showBottomMenu={true}
      showTopMenu={true}
      onBackButton={() => navigate("/")}
    >
      <div className={style["title"]}>Portfolio</div>
      <TabsPanel tabs={tabs} />
    </HeaderLayout>
  );
};
