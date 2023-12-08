import activitygreyIcon from "@assets/svg/wireframe/new-clock.svg";
import selectedHomeTabIcon from "@assets/svg/wireframe/selected-home.svg";
import homeTabIcon from "@assets/svg/wireframe/new-home.svg";
import moreTabIcon from "@assets/svg/wireframe/new-more.svg";
import selectedMoreTabIcon from "@assets/svg/wireframe/selected-more.svg";
import agentIcon from "@assets/svg/wireframe/new-robot.svg";
import { store } from "@chatStore/index";
import {
  WalletConfig,
  notificationsDetails,
  setNotifications,
  walletConfig,
} from "@chatStore/user-slice";
import { NotificationSetup } from "@notificationTypes";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { Tab } from "./tab";
import { WalletActions } from "../../pages-new/main/wallet-actions";

const bottomNav = [
  {
    title: "Home",
    icon: homeTabIcon,
    activeIcon: selectedHomeTabIcon,
    path: "/",
    disabled: false,
    tooltip: "Home",
  },
  {
    title: "More",
    icon: moreTabIcon,
    activeIcon: selectedMoreTabIcon,
    path: "/more",
    disabled: false,
  },
];

export const BottomNav = () => {
  const [isAssetsOpen, setIsAssetsOpen] = useState(false);
  return !isAssetsOpen ? (
    <div className={style["bottomNavContainer"]}>
      <HomeTab />
      <NotificationTab />
      <button
        style={{ cursor: "pointer" }}
        className={style["toggle"]}
        onClick={() => setIsAssetsOpen(!isAssetsOpen)}
      >
        <img src={require("@assets/svg/wireframe/openAsset.svg")} alt="" />
      </button>
      <ActivityTab />
      <MoreTab />
    </div>
  ) : (
    <div>
      <div className={style["overlay"]}></div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className={style["toggle"]}
          onClick={() => setIsAssetsOpen(!isAssetsOpen)}
        >
          <WalletActions />
          <img
            style={{
              height: "43px",
              width: "42px",
              marginBottom: "21px",
              cursor: "pointer",
            }}
            src={require("@assets/svg/wireframe/closeImage.svg")}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};

const HomeTab = () => <Tab {...bottomNav[0]} />;
const NotificationTab = () => {
  const { keyRingStore, accountStore, chainStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const config: WalletConfig = useSelector(walletConfig);
  const notificationInfo: NotificationSetup = useSelector(notificationsDetails);
  const [isComingSoon, setIsComingSoon] = useState<boolean>(true);

  useEffect(() => {
    if (keyRingStore.keyRingType === "ledger") {
      setIsComingSoon(true);
    } else {
      setIsComingSoon(
        config.notiphyWhitelist === undefined
          ? true
          : config.notiphyWhitelist.length !== 0 &&
              config.notiphyWhitelist.indexOf(accountInfo.bech32Address) === -1
      );
    }

    const notificationFlag =
      localStorage.getItem(`turnNotifications-${accountInfo.bech32Address}`) ||
      "true";
    const localNotifications = JSON.parse(
      localStorage.getItem(`notifications-${accountInfo.bech32Address}`) ||
        JSON.stringify([])
    );

    store.dispatch(
      setNotifications({
        allNotifications: localNotifications,
        unreadNotification: localNotifications.length > 0,
        isNotificationOn: notificationFlag == "true",
      })
    );
  }, [accountInfo.bech32Address, config.notiphyWhitelist]);

  return (
    <React.Fragment>
      {!isComingSoon &&
        notificationInfo.unreadNotification &&
        notificationInfo.isNotificationOn && (
          <span className={style["bellDot"]} />
        )}
      <Tab
        title={"Agents"}
        icon={agentIcon}
        path={"/notification"}
        disabled={true}
        tooltip={"Coming Soon"}
      />
    </React.Fragment>
  );
};

const ActivityTab = () => {
  const { keyRingStore, chainStore } = useStore();
  const current = chainStore.current;
  const [activityTooltip, setActivityTooltip] = useState("");
  const [z, setActivityDisabled] = useState(false);
  const isEvm = current.features?.includes("evm") ?? false;
  useEffect(() => {
    if (keyRingStore.keyRingType === "ledger") {
      setActivityTooltip("Coming soon for ledger");
      setActivityDisabled(true);
      return;
    }
    if (isEvm) {
      setActivityTooltip("Feature not available on this network");
      setActivityDisabled(true);
    } else {
      setActivityTooltip("");
      setActivityDisabled(false);
    }
  }, [current.chainId, keyRingStore.keyRingType]);

  return (
    <Tab
      title={"Activity"}
      icon={activitygreyIcon}
      path={"/activity"}
      disabled={z}
      tooltip={activityTooltip}
    />
  );
};
const MoreTab = () => <Tab {...bottomNav[1]} />;
