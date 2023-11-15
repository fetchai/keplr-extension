import React, { useState } from "react";
import { Dropdown } from "../../../../new-components-1/dropdown";
import { SetKeyRingPage } from "../../../keyring-dev";
import { HeaderLayout } from "../../../../new-layout-1";
import style from "../../../../new-components-1/dropdown/style.module.scss";
import { useNavigate } from "react-router";

export const ChangeWallet = () => {
    const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  return (
    <HeaderLayout showChainName={false} canChangeChainInfo={false}>
      <div className={style["overlay"]}></div>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} title="Change Wallet" closeClicked={navigate("/")}>
        <SetKeyRingPage />
      </Dropdown>
    </HeaderLayout>
  );
};
