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
import { Dropdown } from "../../new-components-1/dropdown";
import { ChainList } from "../../new-layout-1/header/chain-list";
import { WalletStatus } from "@keplr-wallet/stores";
import { WalletOptions } from "./wallet-options";

export const MainPage: FunctionComponent = observer(() => {
  const [activeTab, setActiveTab] = useState("Tokens");
  const [isSelectNetOpen, setIsSelectNetOpen] = useState(false);
  const [isSelectWalletOpen, setIsSelectWalletOpen] = useState(false);
  const tabNames = ["Tokens", "NFTs", ".FET Domains"];
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  const intl = useIntl();
  const {
    chainStore,
    accountStore,
    keyRingStore,
    analyticsStore,
    queriesStore,
    uiConfigStore,
  } = useStore();
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
  const icnsPrimaryName = (() => {
    if (
      uiConfigStore.icnsInfo &&
      chainStore.hasChain(uiConfigStore.icnsInfo.chainId)
    ) {
      const queries = queriesStore.get(uiConfigStore.icnsInfo.chainId);
      const icnsQuery = queries.icns.queryICNSNames.getQueryContract(
        uiConfigStore.icnsInfo.resolverContractAddress,
        accountStore.getAccount(chainStore.current.chainId).bech32Address
      );

      return icnsQuery.primaryName;
    }
  })();
  return (
    <HeaderLayout
      showChainName
      canChangeChainInfo
      menuRenderer={<Menu isOpen={false} />}
      rightRenderer={<SwitchUser />}
    >
      <WalletDetailsView
        setIsSelectNetOpen={setIsSelectNetOpen}
        setIsSelectWalletOpen={setIsSelectWalletOpen}
      />
      <WalletActions />
      <div className={style["your-assets"]}>Your assets</div>
      <Tab
        tabNames={tabNames}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <div style={{ marginTop: "18px" }}>
        {activeTab === "Tokens" && <TokensView />}
      </div>
      <Dropdown
        setIsOpen={setIsSelectNetOpen}
        isOpen={isSelectNetOpen}
        title="Change Network"
        closeClicked={()=>setIsSelectNetOpen(false)}
      >
        <ChainList />
      </Dropdown>
      <Dropdown
        setIsOpen={setIsSelectWalletOpen}
        isOpen={isSelectWalletOpen}
        title={(() => {
          if (accountInfo.walletStatus === WalletStatus.Loaded) {
            if (icnsPrimaryName) {
              return icnsPrimaryName;
            }
            if (accountInfo.name) {
              return accountInfo.name;
            }
            return intl.formatMessage({
              id: "setting.keyring.unnamed-account",
            });
          } else if (accountInfo.walletStatus === WalletStatus.Rejected) {
            return "Unable to Load Key";
          } else {
            return "Loading...";
          }
        })()}
        closeClicked={()=>setIsSelectWalletOpen(false)}
      >
        <WalletOptions />
      </Dropdown>
    </HeaderLayout>
  );
});
