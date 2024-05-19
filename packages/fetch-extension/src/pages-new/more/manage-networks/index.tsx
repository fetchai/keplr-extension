import { HeaderLayout } from "@layouts-v2/header-layout";
import React, { FunctionComponent, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import style from "./style.module.scss";
import { TabsPanel } from "@components-v2/tabs/tabsPanel-2";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { Card } from "@components-v2/card";
import { SearchBar } from "@components-v2/search-bar";

export const ManageNetworks: FunctionComponent = observer(() => {
  const intl = useIntl();
  const navigate = useNavigate();

  const { chainStore } = useStore();

  const [cosmosSearchTerm, setCosmosSearchTerm] = useState("");
  const [evmSearchTerm, setEvmSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("Cosmos");

  const mainChainList = chainStore.chainInfos.filter(
    (chainInfo) => !chainInfo.beta && !chainInfo.features?.includes("evm")
  );

  const evmChainList = chainStore.chainInfos.filter((chainInfo) =>
    chainInfo.features?.includes("evm")
  );

  const disabledChainList = chainStore.disabledChainInfosInUI;

  const tabs = [
    {
      id: "Cosmos",
      component: (
        <div>
          <SearchBar
            onSearchTermChange={setCosmosSearchTerm}
            searchTerm={cosmosSearchTerm}
            valuesArray={mainChainList}
            itemsStyleProp={{ overflow: "auto", height: "360px" }}
            renderResult={(chainInfo, index) => (
              <Card
                key={index}
                leftImage={
                  chainInfo.chainName
                    ? chainInfo.chainName[0].toUpperCase()
                    : ""
                }
                heading={chainInfo.chainName}
                rightContent={
                  <div>
                    <label className={style["switch"]}>
                      <input
                        type="checkbox"
                        checked={!disabledChainList.includes(chainInfo)}
                        onChange={() => {
                          chainStore.toggleChainInfoInUI(chainInfo.chainId);
                        }}
                      />
                      <span className={style["slider"]} />
                    </label>
                  </div>
                }
              />
            )}
          />
        </div>
      ),
    },
    {
      id: "EVM",
      component: (
        <div>
          <SearchBar
            searchTerm={evmSearchTerm}
            onSearchTermChange={setEvmSearchTerm}
            valuesArray={evmChainList}
            renderResult={(chainInfo, index) => (
              <Card
                key={index}
                leftImage={
                  chainInfo.chainName
                    ? chainInfo.chainName[0].toUpperCase()
                    : ""
                }
                heading={chainInfo.chainName}
                rightContent={
                  <div>
                    <label className={style["switch"]}>
                      <input
                        type="checkbox"
                        checked={!disabledChainList.includes(chainInfo)}
                        onChange={() => {
                          chainStore.toggleChainInfoInUI(chainInfo.chainId);
                        }}
                      />
                      <span className={style["slider"]} />
                    </label>
                  </div>
                }
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <HeaderLayout
      smallTitle={true}
      showTopMenu={true}
      showChainName={false}
      showBottomMenu={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id:
          selectedTab === "EVM"
            ? "chain.manage-networks.evm"
            : "chain.manage-networks.cosmos",
      })}
      onBackButton={() => {
        navigate("/");
      }}
    >
      <div className={style["chainListContainer"]}>
        <TabsPanel onTabChange={setSelectedTab} tabs={tabs} />
      </div>
    </HeaderLayout>
  );
});
