import React, { useCallback, useState } from "react";
import { Button } from "reactstrap";
import style from "./style.module.scss";
import { Address } from "@components/address";
import styleAccount from "../../pages/main/account.module.scss";
import { useStore } from "../../stores";
import { useIntl } from "react-intl";
import { WalletStatus } from "@keplr-wallet/stores";
import { useNotification } from "@components/notification";
import { ToolTip } from "@components/tooltip";
import { KeplrError } from "@keplr-wallet/router";
import { useNavigate } from "react-router";
import { Assets } from "./assets";
import { Dropdown } from "../../new-components-1/dropdown";
import { ChainList } from "@layouts/header/chain-list";


export const WalletDetailsView = ({
}) => {
  const {
    accountStore,
    chainStore,
    queriesStore,
    uiConfigStore,
    analyticsStore,
  } = useStore();
  const [isSelectNetOpen, setIsSelectNetOpen] = useState(false);
  const [isSelectWalletOpen, setIsSelectWalletOpen] = useState(false);

  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const current = chainStore.current;
  const navigate = useNavigate();
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
  const queries = queriesStore.get(chainStore.current.chainId);
  const rewards = queries.cosmos.queryRewards.getQueryBech32Address(
    accountInfo.bech32Address
  );
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
  const withdrawAllRewards = async () => {
    if (
      accountInfo.isReadyToSendMsgs &&
      chainStore.current.walletUrlForStaking
    ) {
      try {
        // When the user delegated too many validators,
        // it can't be sent to withdraw rewards from all validators due to the block gas limit.
        // So, to prevent this problem, just send the msgs up to 8.
        await accountInfo.cosmos.sendWithdrawDelegationRewardMsgs(
          rewards.getDescendingPendingRewardValidatorAddresses(8),
          "",
          undefined,
          undefined,
          {
            onBroadcasted: () => {
              analyticsStore.logEvent("Claim reward tx broadcasted", {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
              });
            },
          }
        );

        navigate("/", { replace: true });
      } catch (e: any) {
        navigate("/", { replace: true });
        notification.push({
          type: "warning",
          placement: "top-center",
          duration: 5,
          content: `Fail to withdraw rewards: ${e.message}`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      }
    }
  };
  console.log(isSelectWalletOpen, setIsSelectWalletOpen);
  return (
    <div className={style["wallet-details"]}>
      {icnsPrimaryName ? (
        <div style={{ display: "flex", alignItems: "center", height: "1px" }}>
          <img
            style={{
              width: "24px",
              height: "24px",
              marginLeft: "2px",
            }}
            src={require("../../public/assets/img/icns-mark.png")}
            alt="icns-registered"
          />
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <div className={style["wallet-name"]}>
            <div>
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
            <img
              onClick={() => navigate("/setting/set-keyring")}
              style={{ cursor: "pointer" }}
              src={require("@assets/svg/wireframe/chevron-down.svg")}
              alt=""
            />
          </div>
          <div className={style["address"]}>
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
                <div onClick={() => copyAddress(accountInfo.bech32Address)}>
                  <Address maxCharacters={22} lineBreakBeforePrefix={false}>
                    {accountInfo.walletStatus === WalletStatus.Loaded &&
                      accountInfo.bech32Address
                      ? accountInfo.bech32Address
                      : "..."}
                  </Address>
                </div>
                <div style={{ flex: 1 }} />
              </div>
            )}
            {accountInfo.walletStatus !== WalletStatus.Rejected &&
              (isEvm || accountInfo.hasEthereumHexAddress) && (
                <div>
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
                            10
                          )}...${accountInfo.ethereumHexAddress.slice(-8)}`
                          : accountInfo.ethereumHexAddress
                        : "..."}
                    </Address>
                  </div>
                  <div style={{ flex: 1 }} />
                </div>
              )}
            <img
              // style={{ height: "12px", width: "12px" }}
              src={require("@assets/svg/wireframe/copy.svg")}
              alt=""
            />
          </div>
        </div>
        <div
          onClick={() => {
            setIsSelectNetOpen(!isSelectNetOpen);
          }}
          className={style["chain-select"]}
        >
          {current.chainName}
          <img src={require("@assets/svg/wireframe/chevron-down.svg")} alt="" />
        </div>
      </div>
      <Assets />
      <Button
        onClick={withdrawAllRewards}
        data-loading={accountInfo.isSendingMsg === "withdrawRewards"}
        className={style["btn"]}
        style={{ width: "100%" }}
      >
        Claim <span className={style["gradient"]}>staking rewards</span>
      </Button>
      <Dropdown setIsOpen={setIsSelectNetOpen} isOpen={isSelectNetOpen} title="Change Network">
        <ChainList />
      </Dropdown>
    </div>
  );
};
