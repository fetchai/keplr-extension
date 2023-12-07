import { Address } from "@components/address";
import { useNotification } from "@components/notification";
import { ToolTip } from "@components/tooltip";
import { KeplrError } from "@keplr-wallet/router";
import { WalletStatus } from "@keplr-wallet/stores";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { Button } from "reactstrap";
import styleAccount from "../../../pages/main/account.module.scss";
import { useStore } from "../../../stores";
import { Balances } from "../balances";
import style from "../style.module.scss";
import { formatAddress } from "@utils/format";
import { useNavigate } from "react-router";

export const WalletDetailsView = ({
  setIsSelectNetOpen,
  setIsSelectWalletOpen,
}: {
  setIsSelectNetOpen: any;
  setIsSelectWalletOpen?: any;
}) => {
  const { accountStore, chainStore, queriesStore, uiConfigStore } = useStore();
  const navigate = useNavigate();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const current = chainStore.current;
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

  const isEvm = chainStore.current.features?.includes("evm") ?? false;

  const intl = useIntl();
  const notification = useNotification();
  const copyAddress = useCallback(
    async (address: string) => {
      if (accountInfo.walletStatus === WalletStatus.Loaded) {
        await navigator.clipboard.writeText(address);
        notification.push({
          placement: "top-center",
          type: "success",
          duration: 2,
          content: intl.formatMessage({
            id: "main.address.copied",
          }),
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      }
    },
    [accountInfo.walletStatus, notification, intl]
  );

  //withdraw rewards

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <Button
          onClick={() => {
            setIsSelectNetOpen(true);
          }}
          className={style["chain-select"]}
        >
          {formatAddress(current.chainName)}
          <img src={require("@assets/svg/wireframe/chevron-down.svg")} alt="" />
        </Button>
        <Button
          onClick={() => {
            navigate("/chat");
          }}
          className={style["chat-button"]}
        >
          <img src={require("@assets/svg/wireframe/chatIcon.svg")} alt="" />
        </Button>
      </div>
      <div className={style["wallet-detail-card"]}>
        <div>
          <div className={style["wallet-address"]}>
            {(() => {
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
          </div>
          <div>
            {accountInfo.walletStatus === WalletStatus.Rejected && (
              <ToolTip
                tooltip={(() => {
                  if (
                    accountInfo.rejectionReason &&
                    accountInfo.rejectionReason instanceof KeplrError &&
                    accountInfo.rejectionReason.module === "keyring" &&
                    accountInfo.rejectionReason.code === 152
                  ) {
                    // Return unsupported device message
                    return "Ledger is not supported for this chain";
                  }

                  let result = "Failed to load account by unknown reason";
                  if (accountInfo.rejectionReason) {
                    result += `: ${accountInfo.rejectionReason.toString()}`;
                  }

                  return result;
                })()}
                theme="dark"
                trigger="hover"
                options={{
                  placement: "top",
                }}
              >
                <i
                  className={`fas fa-exclamation-triangle text-danger ${styleAccount["unsupportedKeyIcon"]}`}
                />
              </ToolTip>
            )}
            {accountInfo.walletStatus !== WalletStatus.Rejected && !isEvm && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: "0.6",
                  }}
                >
                  <Address maxCharacters={16} lineBreakBeforePrefix={false}>
                    {accountInfo.walletStatus === WalletStatus.Loaded &&
                    accountInfo.bech32Address
                      ? accountInfo.bech32Address
                      : "..."}
                  </Address>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => copyAddress(accountInfo.bech32Address)}
                    src={require("@assets/svg/wireframe/copy.svg")}
                    alt=""
                  />
                </div>
              </div>
            )}
            {accountInfo.walletStatus !== WalletStatus.Rejected &&
              (isEvm || accountInfo.hasEthereumHexAddress) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    onClick={() => copyAddress(accountInfo.ethereumHexAddress)}
                  >
                    <Address
                      isRaw={true}
                      tooltipAddress={accountInfo.ethereumHexAddress}
                    >
                      {accountInfo.walletStatus === WalletStatus.Loaded &&
                      accountInfo.ethereumHexAddress
                        ? accountInfo.ethereumHexAddress.length === 42
                          ? `${accountInfo.ethereumHexAddress.slice(
                              0,
                              6
                            )}...${accountInfo.ethereumHexAddress.slice(-6)}`
                          : accountInfo.ethereumHexAddress
                        : "..."}
                    </Address>
                  </div>
                  <img
                    onClick={() => copyAddress(accountInfo.bech32Address)}
                    src={require("@assets/svg/wireframe/copy.svg")}
                    alt=""
                  />
                </div>
              )}
          </div>
        </div>
        <Button
          onClick={() => setIsSelectWalletOpen(true)}
          className={style["change-net"]}
        >
          <img
            style={{ width: "14px", height: "16px" }}
            src={require("@assets/svg/wireframe/changeNet.svg")}
            alt=""
          />
        </Button>
      </div>
      {icnsPrimaryName ? (
        <div style={{ display: "flex", alignItems: "center", height: "1px" }}>
          <img
            style={{
              width: "24px",
              height: "24px",
              marginLeft: "2px",
            }}
            src={require("../../../public/assets/img/icns-mark.png")}
            alt="icns-registered"
          />
        </div>
      ) : null}

      <Balances />
    </div>
  );
};
