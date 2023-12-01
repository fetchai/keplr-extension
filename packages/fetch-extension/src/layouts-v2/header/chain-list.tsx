import classnames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { store } from "@chatStore/index";
import {
  resetChatList,
  setIsChatSubscriptionActive,
} from "@chatStore/messages-slice";
import { resetUser } from "@chatStore/user-slice";
import { messageAndGroupListenerUnsubscribe } from "@graphQL/messages-api";
import { useStore } from "../../stores";
import style from "./chain-list.module.scss";
import { resetProposals } from "@chatStore/proposal-slice";
import { Card } from "@components-v2/card";
import { ButtonGradient } from "@components-v2/buttons/button-gradient";
import { useConfirm } from "@components/confirm";
import { TabsPanel } from "@components-v2/tabsPanel";
import { formatAddress } from "@utils/format";

interface ChainListProps {
  showAddress?: boolean;
}
export const ChainList: FunctionComponent<ChainListProps> = observer(
  ({ showAddress }) => {
    const { chainStore, analyticsStore, accountStore } = useStore();
    const intl = useIntl();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const mainChainList = chainStore.chainInfosInUI.filter(
      (chainInfo) => !chainInfo.beta && !chainInfo.features?.includes("evm")
    );

    const evmChainList = chainStore.chainInfosInUI.filter((chainInfo) =>
      chainInfo.features?.includes("evm")
    );

    const betaChainList = chainStore.chainInfosInUI.filter(
      (chainInfo) => chainInfo.beta
    );
    const tabs = [
      {
        id: "Cosmos",
        component: (
          <div>
            {mainChainList.map((chainInfo) => (
              <Card
                leftImage={
                  chainInfo.chainName
                    ? chainInfo.chainName[0].toUpperCase()
                    : ""
                }
                heading={chainInfo.chainName}
                isActive={chainInfo.chainId === chainStore.current.chainId}
                rightContent={
                  chainInfo.chainId === chainStore.current.chainId
                    ? require("@assets/svg/wireframe/check.svg")
                    : ""
                }
                onClick={() => {
                  // navigate("/");
                  let properties = {};
                  if (chainInfo.chainId !== chainStore.current.chainId) {
                    properties = {
                      chainId: chainStore.current.chainId,
                      chainName: chainStore.current.chainName,
                      toChainId: chainInfo.chainId,
                      toChainName: chainInfo.chainName,
                    };
                  }
                  chainStore.selectChain(chainInfo.chainId);
                  chainStore.saveLastViewChainId();
                  store.dispatch(resetUser({}));
                  store.dispatch(resetProposals({}));

                  store.dispatch(resetChatList({}));
                  store.dispatch(setIsChatSubscriptionActive(false));
                  messageAndGroupListenerUnsubscribe();

                  if (Object.values(properties).length > 0) {
                    analyticsStore.logEvent("Chain changed", properties);
                  }
                }}
                subheading={
                  showAddress
                    ? formatAddress(accountStore.getAccount(chainInfo.chainId).bech32Address)
                    : null
                }
              />
            ))}
            <div className={style["chain-title"]}>
              {betaChainList.length > 0 ? "Beta support" : null}
            </div>

            {betaChainList.map((chainInfo) => (
              <Card
                leftImage={
                  chainInfo.chainName
                    ? chainInfo.chainName[0].toUpperCase()
                    : ""
                }
                heading={chainInfo.chainName}
                isActive={chainInfo.chainId === chainStore.current.chainId}
                rightContent={require("@assets/svg/wireframe/closeImage.svg")}
                rightContentStyle={{ height: "24px", width: "24px" }}
                rightContentOnClick={async (e: any) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (
                    await confirm.confirm({
                      paragraph: intl.formatMessage(
                        {
                          id: "chain.remove.confirm.paragraph",
                        },
                        {
                          chainName: chainInfo.chainName,
                        }
                      ),
                    })
                  ) {
                    await chainStore.removeChainInfo(chainInfo.chainId);
                  }
                }}
                onClick={() => {
                  let properties = {};
                  if (chainInfo.chainId !== chainStore.current.chainId) {
                    properties = {
                      chainId: chainStore.current.chainId,
                      chainName: chainStore.current.chainName,
                      toChainId: chainInfo.chainId,
                      toChainName: chainInfo.chainName,
                    };
                  }
                  chainStore.selectChain(chainInfo.chainId);
                  chainStore.saveLastViewChainId();
                  store.dispatch(resetUser({}));
                  store.dispatch(resetProposals({}));

                  store.dispatch(resetChatList({}));
                  store.dispatch(setIsChatSubscriptionActive(false));
                  messageAndGroupListenerUnsubscribe();
                  // navigate("/");
                  if (Object.values(properties).length > 0) {
                    analyticsStore.logEvent("Chain changed", properties);
                  }
                }}
                subheading={
                  showAddress
                    ? formatAddress(
                        accountStore.getAccount(chainInfo.chainId).bech32Address
                      )
                    : null
                }
              />
            ))}

            <a
              href="https://chains.keplr.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "none" }}
            >
              <div
                className={classnames(style["chainName"], style["addChain"])}
              >
                <div>
                  {intl.formatMessage({ id: "main.suggest.chain.link" })}
                </div>
              </div>
            </a>
          </div>
        ),
      },
      {
        id: "EVM",
        component: (
          <div>
            {evmChainList.map((chainInfo) => (
              <Card
                leftImage={
                  chainInfo.chainName
                    ? chainInfo.chainName[0].toUpperCase()
                    : ""
                }
                heading={chainInfo.chainName}
                isActive={chainInfo.chainId === chainStore.current.chainId}
                rightContent={
                  chainInfo.chainId === chainStore.current.chainId
                    ? require("@assets/svg/wireframe/check.svg")
                    : ""
                }
                onClick={() => {
                  let properties = {};
                  if (chainInfo.chainId !== chainStore.current.chainId) {
                    properties = {
                      chainId: chainStore.current.chainId,
                      chainName: chainStore.current.chainName,
                      toChainId: chainInfo.chainId,
                      toChainName: chainInfo.chainName,
                    };
                  }
                  chainStore.selectChain(chainInfo.chainId);
                  chainStore.saveLastViewChainId();
                  store.dispatch(resetUser({}));
                  store.dispatch(resetProposals({}));

                  store.dispatch(resetChatList({}));
                  store.dispatch(setIsChatSubscriptionActive(false));
                  messageAndGroupListenerUnsubscribe();
                  // navigate("/");
                  if (Object.values(properties).length > 0) {
                    analyticsStore.logEvent("Chain changed", properties);
                  }
                }}
                subheading={
                  showAddress
                    ? formatAddress(
                        accountStore.getAccount(chainInfo.chainId).bech32Address
                      )
                    : null
                }
              />
            ))}
            <div style={{ position: "absolute", bottom: "5px", width: "94%" }}>
              <ButtonGradient
                onClick={(e: any) => {
                  e.preventDefault();
                  navigate("/setting/addEvmChain");
                }}
                gradientText={""}
                text={"Add custom EVM network"}
              />
            </div>
          </div>
        ),
      },
    ];
    return (
      <div className={style["chainListContainer"]}>
        <TabsPanel tabs={tabs} />
      </div>
    );
  }
);
