import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { useNavigate } from "react-router";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";

export const WalletOptions = observer(
  ({ setIsOptionsOpen, setIsSelectWalletOpen }: any) => {
    const [accountIndex, setAccountIndex] = useState<number>(0);

    const navigate = useNavigate();
    const { keyRingStore, analyticsStore } = useStore();
    useEffect(() => {
      const firstAccountIndex = keyRingStore.multiKeyStoreInfo.findIndex(
        (value) => value.selected
      );
      setAccountIndex(firstAccountIndex);
    }, [keyRingStore.multiKeyStoreInfo]);

    return (
      <div className={style["container"]}>
        <button
          onClick={(e: any) => {
            e.preventDefault();
            analyticsStore.logEvent("Add additional account started");

            browser.tabs.create({
              url: "/popup.html#/register",
            });
          }}
          className={style["inner-field"]}
        >
          <img
            className={style["optins-icon"]}
            src={require("@assets/svg/wireframe/plus.svg")}
            alt=""
          />{" "}
          Add new Wallet
        </button>
        <button
          onClick={() => {
            setIsOptionsOpen(true);
            setIsSelectWalletOpen(false);
          }}
          className={style["inner-field"]}
        >
          <img
            className={style["optins-icon"]}
            src={require("@assets/svg/wireframe/change.svg")}
            alt=""
          />{" "}
          Change Wallet
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/setting/keyring/change/name/${accountIndex}`);
          }}
          className={style["inner-field"]}
        >
          <img
            className={style["optins-icon"]}
            src={require("@assets/svg/wireframe/rename.svg")}
            alt=""
          />{" "}
          Rename Wallet
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/setting/clear/${accountIndex}`);
          }}
          className={style["inner-field"]}
          style={{ color: "var(--orange-orange-400, #FA8F6B)" }}
        >
          <img
            className={style["optins-icon"]}
            src={require("@assets/svg/wireframe/delete.svg")}
            alt=""
          />{" "}
          Delete Wallet
        </button>
      </div>
    );
  }
);
