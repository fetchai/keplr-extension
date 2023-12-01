import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { HeaderLayout } from "@layouts-v2/header-layout";

import { store } from "@chatStore/index";
import { setAccessToken, setWalletConfig } from "@chatStore/user-slice";
import { useConfirm } from "@components/confirm";
import { getWalletConfig } from "@graphQL/config-api";
import { getJWT } from "@utils/auth";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { AUTH_SERVER } from "../../config.ui.var";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { TokensView } from "./tokens";
import { WalletActions } from "./wallet-actions";
import { WalletDetailsView } from "./wallet-details";
import { TabsPanel } from "@components-v2/tabsPanel";
import { Dropdown } from "@components-v2/dropdown";
import { ChainList } from "@layouts-v2/header/chain-list";
import { WalletStatus } from "@keplr-wallet/stores";
import { WalletOptions } from "./wallet-options";
import { SetKeyRingPage } from "../keyring-dev";
export const MainPage: FunctionComponent = observer(() => {
  const [isSelectNetOpen, setIsSelectNetOpen] = useState(false);
  const [isSelectWalletOpen, setIsSelectWalletOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);

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
  }, [
    chainStore,
    chainStore.current.chainId,
    accountInfo.bech32Address,
    keyRingStore.keyRingType,
  ]);

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
  const tabs = [
    { id: "Tokens", component: <TokensView /> },
    { id: "NFTs", disabled: true },
    { id: ".FET Domains", disabled: true },
  ];

  return (
    <HeaderLayout>
      <WalletDetailsView
        setIsSelectNetOpen={setIsSelectNetOpen}
        setIsSelectWalletOpen={setIsSelectWalletOpen}
      />
      <WalletActions />
      <div className={style["your-assets"]}>Your assets</div>
      <TabsPanel tabs={tabs} />
      <Dropdown
        styleProp={{ height: "595px", maxHeight: "595px" }}
        setIsOpen={setIsSelectNetOpen}
        isOpen={isSelectNetOpen}
        title="Change Network"
        closeClicked={() => setIsSelectNetOpen(false)}
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
        closeClicked={() => setIsSelectWalletOpen(false)}
      >
        <WalletOptions
          setIsSelectWalletOpen={setIsSelectWalletOpen}
          setIsOptionsOpen={setIsOptionsOpen}
        />
      </Dropdown>
      <Dropdown
        isOpen={isOptionsOpen}
        setIsOpen={setIsOptionsOpen}
        title="Change Wallet"
        closeClicked={() => setIsOptionsOpen(false)}
      >
        <SetKeyRingPage />
      </Dropdown>
    </HeaderLayout>
  );
});
