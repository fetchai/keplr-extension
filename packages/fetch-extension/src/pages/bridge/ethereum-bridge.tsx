import React, { FunctionComponent, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useLocation } from "react-router";

import style from "./style.module.scss";
import { Button } from "reactstrap";
import { AddressInput, CoinInput, FeeButtons } from "@components/form";
import {
  IAmountConfig,
  IFeeConfig,
  IGasConfig,
  IMemoConfig,
  IRecipientConfig,
  useGasSimulator,
  useNativeBridgeConfig,
} from "@keplr-wallet/hooks";
import { useStore } from "../../stores";
import { useNotification } from "@components/notification";
import { FormattedMessage, useIntl } from "react-intl";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { AppCurrency } from "@keplr-wallet/types";
import { Dec, DecUtils, IntPretty } from "@keplr-wallet/unit";
import queryString from "querystring";

import { BigNumber } from "@ethersproject/bignumber";

export const EthereumBridge: FunctionComponent = observer(() => {
  const [phase, setPhase] = useState<"configure" | "approve" | "bridge">(
    "configure"
  );
  const [approvalAmount, setApprovalAmount] = useState<string>("0");

  let search = useLocation().search;
  if (search.startsWith("?")) {
    search = search.slice(1);
  }
  const query = queryString.parse(search) as {
    defaultRecipient: string | undefined;
    defaultAmount: string | undefined;
  };

  const { chainStore, accountStore, queriesStore } = useStore();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const nativeBridgeConfig = useNativeBridgeConfig(
    chainStore,
    queriesStore,
    chainStore.current.chainId,
    accountInfo.bech32Address
  );

  useEffect(() => {
    if (query.defaultRecipient) {
      nativeBridgeConfig.recipientConfig.setRawRecipient(
        query.defaultRecipient
      );
    }
    if (query.defaultAmount) {
      nativeBridgeConfig.amountConfig.setAmount(query.defaultAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.defaultAmount, query.defaultRecipient]);

  if (accountInfo.txTypeInProgress === "nativeBridgeSend") {
    return (
      <p
        style={{
          textAlign: "center",
          position: "relative",
          top: "45%",
        }}
      >
        Bridging in progress <i className="fa fa-spinner fa-spin fa-fw" />{" "}
      </p>
    );
  }

  return (
    <div>
      {phase === "configure" ? (
        <Configure
          amountConfig={nativeBridgeConfig.amountConfig}
          recipientConfig={nativeBridgeConfig.recipientConfig}
          memoConfig={nativeBridgeConfig.memoConfig}
          setApprovalAmount={setApprovalAmount}
          setPhase={setPhase}
        />
      ) : null}
      {phase === "approve" ? (
        <Approve
          amountConfig={nativeBridgeConfig.amountConfig}
          recipientConfig={nativeBridgeConfig.recipientConfig}
          feeConfig={nativeBridgeConfig.feeConfig}
          gasConfig={nativeBridgeConfig.gasConfig}
          approvalAmount={approvalAmount}
          currency={nativeBridgeConfig.amountConfig.sendCurrency}
        />
      ) : null}
      {phase === "bridge" ? (
        <Bridge
          feeConfig={nativeBridgeConfig.feeConfig}
          gasConfig={nativeBridgeConfig.gasConfig}
          bridgeAmount={nativeBridgeConfig.amountConfig.amount}
          currency={nativeBridgeConfig.amountConfig.sendCurrency}
          recipient={nativeBridgeConfig.recipientConfig.recipient}
        />
      ) : null}
    </div>
  );
});

export const Configure: FunctionComponent<{
  amountConfig: IAmountConfig;
  recipientConfig: IRecipientConfig;
  memoConfig: IMemoConfig;
  setApprovalAmount: React.Dispatch<React.SetStateAction<string>>;
  setPhase: React.Dispatch<
    React.SetStateAction<"configure" | "approve" | "bridge">
  >;
}> = observer(
  ({
    amountConfig,
    recipientConfig,
    memoConfig,
    setApprovalAmount,
    setPhase,
  }) => {
    const intl = useIntl();

    const { chainStore, queriesStore, accountStore } = useStore();

    const navigate = useNavigate();

    const accountInfo = accountStore.getAccount(chainStore.current.chainId);
    const allowanceQuery = queriesStore
      .get(chainStore.current.chainId)
      .evm.queryERC20Allowance.getQueryAllowance(
        accountInfo.bech32Address,
        "0x947872ad4d95e89E513d7202550A810aC1B626cC",
        "0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85"
      );

    const isValid =
      recipientConfig.error == null &&
      memoConfig.error == null &&
      amountConfig.error == null &&
      !allowanceQuery.isFetching &&
      accountInfo.txTypeInProgress !== "approval";

    return (
      <form className={style["formContainer"]}>
        <div className={style["formInnerContainer"]}>
          <AddressInput
            label={intl.formatMessage({
              id: "send.input.recipient",
            })}
            recipientConfig={recipientConfig}
            disableAddressBook
            value={""}
          />
          <div
            style={{
              overflowWrap: "anywhere",
              fontSize: "small",
              marginTop: "-15px",
              marginBottom: "15px",
              cursor: "pointer",
              textDecoration: "underline",
              color: "#555555",
            }}
            onClick={(e) => {
              e.preventDefault();
              recipientConfig.setRawRecipient(
                accountStore.getAccount("fetchhub-4").bech32Address
              );
            }}
          >
            Bridge to your Fetchhub address:{" "}
            {accountStore.getAccount("fetchhub-4").bech32Address}
          </div>

          <div style={{ flex: 1 }} />

          <CoinInput
            label={intl.formatMessage({
              id: "send.input.amount",
            })}
            amountConfig={amountConfig}
          />
          <div style={{ flex: 1 }} />

          <Button
            type="submit"
            color="primary"
            block
            disabled={!isValid}
            data-loading={allowanceQuery.isFetching}
            onClick={(e) => {
              e.preventDefault();
              if (!allowanceQuery.allowance || allowanceQuery.error) {
                navigate(-1);
                throw new Error("Failed to fetch allowance");
                // TODO: Add error notification
              }

              const currentAllowance = BigNumber.from(allowanceQuery.allowance);
              const currencyDecimals = amountConfig.sendCurrency.coinDecimals;

              let dec = new Dec(amountConfig.amount);
              dec = dec.mul(
                DecUtils.getTenExponentNInPrecisionRange(currencyDecimals)
              );
              const amountToBridge = BigNumber.from(dec.truncate().toString());

              if (currentAllowance.gte(amountToBridge)) {
                // Open bridge page directly
                return setPhase("bridge");
              }

              const toApproveAmount = amountToBridge.sub(currentAllowance);
              let approvalAmountInFET = new Dec(toApproveAmount.toString());
              approvalAmountInFET = approvalAmountInFET.quo(
                DecUtils.getTenExponentNInPrecisionRange(currencyDecimals)
              );
              setApprovalAmount(approvalAmountInFET.toString());
              setPhase("approve");
            }}
          >
            {accountInfo.txTypeInProgress === "approval" ? (
              <p style={{ marginBottom: 0 }}>
                Allowance in progress{" "}
                <i className="fa fa-spinner fa-spin fa-fw" />
              </p>
            ) : (
              <FormattedMessage id="ibc.transfer.next" />
            )}
          </Button>
        </div>
      </form>
    );
  }
);

export const Approve: FunctionComponent<{
  amountConfig: IAmountConfig;
  recipientConfig: IRecipientConfig;
  feeConfig: IFeeConfig;
  gasConfig: IGasConfig;
  approvalAmount: string;
  currency: AppCurrency;
}> = observer(
  ({
    amountConfig,
    recipientConfig,
    feeConfig,
    gasConfig,
    approvalAmount,
    currency,
  }) => {
    const intl = useIntl();
    const notification = useNotification();

    const isValid = feeConfig.error == null && gasConfig.error == null;

    const navigate = useNavigate();

    const { chainStore, priceStore, accountStore } = useStore();

    const approveGasSimulator = useGasSimulator(
      new ExtensionKVStore("gas-simulator.native-bridge.approve"),
      chainStore,
      chainStore.current.chainId,
      gasConfig,
      feeConfig,
      "bridge-approve",
      () => {
        return accountStore
          .getAccount(chainStore.current.chainId)
          .ethereum.makeApprovalTx(
            amountConfig.amount,
            "0x947872ad4d95e89E513d7202550A810aC1B626cC",
            currency
          );
      }
    );

    return (
      <form className={style["formContainer"]}>
        <div className={style["formInnerContainer"]}>
          <p>
            Need to approve additional{" "}
            {new IntPretty(approvalAmount).maxDecimals(2).toString()}
          </p>
          <FeeButtons
            label={intl.formatMessage({
              id: "send.input.fee",
            })}
            feeConfig={feeConfig}
            gasConfig={gasConfig}
            priceStore={priceStore}
            gasSimulator={approveGasSimulator}
          />

          <Button
            type="submit"
            color="primary"
            block
            disabled={!isValid}
            onClick={async (e) => {
              e.preventDefault();

              const stdFee = feeConfig.toStdFee();

              await accountStore
                .getAccount(chainStore.current.chainId)
                .ethereum.makeApprovalTx(
                  amountConfig.amount,
                  "0x947872ad4d95e89E513d7202550A810aC1B626cC",
                  currency
                )
                .send(
                  stdFee,
                  "",
                  {
                    preferNoSetFee: true,
                    preferNoSetMemo: true,
                  },
                  {
                    onFulfill(tx) {
                      if (tx.status && tx.status === 1) {
                        notification.push({
                          placement: "top-center",
                          type: "success",
                          duration: 2,
                          content: "Approval Successful",
                          canDelete: true,
                          transition: {
                            duration: 0.25,
                          },
                        });
                      } else {
                        notification.push({
                          placement: "top-center",
                          type: "danger",
                          duration: 2,
                          content: "Approval Failed, try again",
                          canDelete: true,
                          transition: {
                            duration: 0.25,
                          },
                        });
                      }
                    },
                    onBroadcasted() {
                      gasConfig.setGas(0);
                      navigate(
                        `/bridge?defaultRecipient=${recipientConfig.recipient}&defaultAmount=${amountConfig.amount}`
                      );
                    },
                  }

                  // (tx) => {
                  //   if (tx.status && tx.status === 1) {
                  //     notification.push({
                  //       placement: "top-center",
                  //       type: "success",
                  //       duration: 2,
                  //       content: "Approval Successful",
                  //       canDelete: true,
                  //       transition: {
                  //         duration: 0.25,
                  //       },
                  //     });
                  //   } else {
                  //     notification.push({
                  //       placement: "top-center",
                  //       type: "danger",
                  //       duration: 2,
                  //       content: "Approval Failed, try again",
                  //       canDelete: true,
                  //       transition: {
                  //         duration: 0.25,
                  //       },
                  //     });
                  //   }
                  //   gasConfig.setGas(0);
                  //   navigate(`/bridge?defaultRecipient=${recipientConfig.recipient}&defaultAmount=${amountConfig.amount}`);
                  // }
                );
            }}
          >
            <FormattedMessage id="ibc.transfer.next" />
          </Button>
        </div>
      </form>
    );
  }
);

export const Bridge: FunctionComponent<{
  feeConfig: IFeeConfig;
  gasConfig: IGasConfig;
  bridgeAmount: string;
  recipient: string;
  currency: AppCurrency;
}> = observer(({ feeConfig, gasConfig, bridgeAmount, currency, recipient }) => {
  const intl = useIntl();
  const isValid = feeConfig.error == null && gasConfig.error == null;

  const navigate = useNavigate();
  const notification = useNotification();

  const { chainStore, priceStore, accountStore } = useStore();

  const bridgeGasSimulator = useGasSimulator(
    new ExtensionKVStore("gas-simulator.native-bridge.bridge"),
    chainStore,
    chainStore.current.chainId,
    gasConfig,
    feeConfig,
    "bridge",
    () => {
      return accountStore
        .getAccount(chainStore.current.chainId)
        .ethereum.makeNativeBridgeTx(bridgeAmount, recipient);
    }
  );

  return (
    <form className={style["formContainer"]}>
      <div className={style["formInnerContainer"]}>
        <p>
          Bridging {new IntPretty(bridgeAmount).maxDecimals(2).toString()}{" "}
          {currency.coinDenom} to {recipient}
        </p>
        <FeeButtons
          label={intl.formatMessage({
            id: "send.input.fee",
          })}
          feeConfig={feeConfig}
          gasConfig={gasConfig}
          priceStore={priceStore}
          gasSimulator={bridgeGasSimulator}
        />

        <Button
          type="submit"
          color="primary"
          block
          disabled={!isValid}
          onClick={async (e) => {
            e.preventDefault();

            const stdFee = feeConfig.toStdFee();

            await accountStore
              .getAccount(chainStore.current.chainId)
              .ethereum.makeNativeBridgeTx(bridgeAmount, recipient)
              .send(
                stdFee,
                "",
                {
                  preferNoSetFee: true,
                  preferNoSetMemo: true,
                },
                {
                  onFulfill(tx) {
                    if (tx.status && tx.status === 1) {
                      notification.push({
                        placement: "top-center",
                        type: "success",
                        duration: 2,
                        content: "Bridge Successful",
                        canDelete: true,
                        transition: {
                          duration: 0.25,
                        },
                      });
                    } else {
                      notification.push({
                        placement: "top-center",
                        type: "danger",
                        duration: 2,
                        content: "Bridge Failed, try again",
                        canDelete: true,
                        transition: {
                          duration: 0.25,
                        },
                      });
                    }
                    navigate("/");
                  },
                  onBroadcasted() {
                    navigate(`/bridge`);
                  },
                }
                // (tx) => {
                //   if (tx.status && tx.status === 1) {
                //     notification.push({
                //       placement: "top-center",
                //       type: "success",
                //       duration: 2,
                //       content: "Bridging Successful",
                //       canDelete: true,
                //       transition: {
                //         duration: 0.25,
                //       },
                //     });
                //   } else {
                //     notification.push({
                //       placement: "top-center",
                //       type: "danger",
                //       duration: 2,
                //       content: "Bridging Failed",
                //       canDelete: true,
                //       transition: {
                //         duration: 0.25,
                //       },
                //     });
                //   }
                //   navigate('/');
                // }
              );
          }}
        >
          <FormattedMessage id="ibc.transfer.next" />
        </Button>
      </div>
    </form>
  );
});
