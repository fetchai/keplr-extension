import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { HeaderLayout } from "../../new-layout-1";

import { store } from "@chatStore/index";
import { setAccessToken, setWalletConfig } from "@chatStore/user-slice";
import { useConfirm } from "@components/confirm";
import { SwitchUser } from "@components/switch-user";
import { getWalletConfig } from "@graphQL/config-api";
import { getJWT } from "@utils/auth";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { AUTH_SERVER } from "../../config.ui.var";
import { Menu } from "../../new-layout-1/menu";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { TokensView } from "./tokens";
import { WalletActions } from "./wallet-actions";
import { WalletDetailsView } from "./wallet-details";
// import { ToolTip } from "@components/tooltip";
import { Tab } from "../../new-components-1/tab";

export const MainPage: FunctionComponent = observer(() => {
  
  const [activeTab, setActiveTab] = useState("Tokens");
  const tabNames = ["Tokens", "NFTs", ".FET Domains"];
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  const intl = useIntl();
  const { chainStore, accountStore, keyRingStore, analyticsStore } = useStore();

  useEffect(() => {
    analyticsStore.logEvent("Home tab click");
    analyticsStore.setUserProperties({
      totalAccounts: keyRingStore.multiKeyStoreInfo.length,
    });
  }, [analyticsStore, keyRingStore.multiKeyStoreInfo.length]);

  const confirm = useConfirm();

  const current = chainStore.current;
  const currentChainId = current.chainId;
  const prevChainId = useRef<string | undefined>();
  useEffect(() => {
    if (!chainStore.isInitializing && prevChainId.current !== currentChainId) {
      (async () => {
        try {
          await chainStore.tryUpdateChain(chainStore.current.chainId);
        } catch (e) {
          console.log(e);
        }
      })();

      prevChainId.current = currentChainId;
    }
  }, [chainStore, confirm, chainStore.isInitializing, currentChainId, intl]);

  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  /// Fetching wallet config info
  useEffect(() => {
    if (keyRingStore.keyRingType === "ledger") {
      return;
    }
    getJWT(chainStore.current.chainId, AUTH_SERVER).then((res) => {
      store.dispatch(setAccessToken(res));
      getWalletConfig()
        .then((config) => store.dispatch(setWalletConfig(config)))
        .catch((error) => {
          console.log(error);
        });
    });
  }, [chainStore.current.chainId, accountInfo.bech32Address]);

  return (
    <HeaderLayout
      showChainName
      canChangeChainInfo
      menuRenderer={<Menu isOpen={false} />}
      rightRenderer={<SwitchUser />}
  
    >
      <WalletDetailsView
      />
      <WalletActions />
      <div className={style["your-assets"]}>Your assets</div>
      <Tab
        tabNames={tabNames}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <div style={{ marginTop: "18px" }}>
        {" "}
        {activeTab === "Tokens" && <TokensView />}
      </div>{" "}
    </HeaderLayout>
  );
});
