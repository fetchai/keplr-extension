import { HeaderLayout } from "@layouts-v2/header-layout";
import React from "react";
import { useNavigate } from "react-router";
import style from "./style.module.scss";
import { Dashboard } from "./dashboard";

export const Stake = () => {
  const navigate = useNavigate();

  return (
    <HeaderLayout
      showBottomMenu={true}
      showTopMenu={false}
      onBackButton={() => navigate("/")}
    >
      <div className={style["title"]}>Stake</div>
      <Dashboard />
    </HeaderLayout>
  );
};
