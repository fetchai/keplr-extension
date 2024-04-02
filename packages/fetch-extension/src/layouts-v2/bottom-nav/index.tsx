import activityIcon from "@assets/svg/wireframe/new-clock-white.svg";
import activitygreyIcon from "@assets/svg/wireframe/new-clock.svg";

import homeTabIcon from "@assets/svg/wireframe/new-home.svg";
import moreTabIcon from "@assets/svg/wireframe/new-more.svg";
import agentIcon from "@assets/svg/wireframe/new-robot.svg";
import selectedHomeTabIcon from "@assets/svg/wireframe/selected-home.svg";
import selectedMoreTabIcon from "@assets/svg/wireframe/selected-more.svg";
import { NotificationSetup } from "@notificationTypes";
import React, { useEffect, useState } from "react";
import { WalletActions } from "../../pages-new/main/wallet-actions";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { Tab } from "./tab";

interface WalletConfig {
  notiphyWhitelist: string[] | undefined;
  fetchbotActive: boolean;
  requiredNative: boolean;
}

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
    <WalletActions isOpen={isAssetsOpen} setIsOpen={setIsAssetsOpen} />
  );
};

const HomeTab = () => <Tab {...bottomNav[0]} />;
const NotificationTab = () => {
  const { keyRingStore, accountStore, chainStore, chatStore } = useStore();
  const current = chainStore.current;
  const userState = chatStore.userDetailsStore;
  const accountInfo = accountStore.getAccount(current.chainId);
  const config: WalletConfig = userState.walletConfig;
  const notificationInfo: NotificationSetup = userState.notifications;
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

    userState.setNotifications({
      allNotifications: localNotifications,
      unreadNotification: localNotifications.length > 0,
      isNotificationOn: notificationFlag == "true",
    });
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
      activeIcon={activityIcon}
      path={"/activity"}
      disabled={z}
      tooltip={activityTooltip}
    />
  );
};
const MoreTab = () => <Tab {...bottomNav[1]} />;
