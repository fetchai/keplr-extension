import React, { FunctionComponent, useEffect, useMemo } from "react";
import {
  AddressInput,
  FeeButtons,
  CoinInput,
  MemoInput,
} from "@components/form";
import { useStore } from "../../stores";

import { HeaderLayout } from "@layouts/index";

import { observer } from "mobx-react-lite";

import style from "./style.module.scss";
import { useNotification } from "@components/notification";

import { useIntl } from "react-intl";
import { Button } from "reactstrap";

import { useNavigate, useLocation } from "react-router";
import queryString from "querystring";

import { useGasSimulator, useSendTxConfig } from "@keplr-wallet/hooks";
import {
  fitPopupWindow,
  openPopupWindow,
  PopupSize,
} from "@keplr-wallet/popup";
import { DenomHelper, ExtensionKVStore } from "@keplr-wallet/common";
import { InitialGas } from "../../config.ui";
import { SendTxAndRecordMsg } from "@keplr-wallet/background";
import { DecUtils } from "@keplr-wallet/unit";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";

export const SendPage: FunctionComponent = observer(() => {
  const navigate = useNavigate();
  let search = useLocation().search;
  if (search.startsWith("?")) {
    search = search.slice(1);
  }
  const query = queryString.parse(search) as {
    defaultDenom: string | undefined;
    defaultRecipient: string | undefined;
    defaultAmount: string | undefined;
    defaultMemo: string | undefined;
    detached: string | undefined;
  };

  useEffect(() => {
    // Scroll to top on page mounted.
    if (window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, []);

  const intl = useIntl();

  const notification = useNotification();

  const {
    chainStore,
    accountStore,
    priceStore,
    queriesStore,
    uiConfigStore,
  } = useStore();

  const historyType = "basic-send";

  const current = chainStore.current;

  const accountInfo = accountStore.getAccount(current.chainId);

  const sendConfigs = useSendTxConfig(
    chainStore,
    queriesStore,
    current.chainId,
    accountInfo.bech32Address,
    InitialGas,
    {
      allowHexAddressOnEthermint: true,
      icns: uiConfigStore.icnsInfo,
      computeTerraClassicTax: true,
    }
  );

  const gasSimulatorKey = useMemo(() => {
    if (sendConfigs.amountConfig.amount[0].currency) {
      const denomHelper = new DenomHelper(
        sendConfigs.amountConfig.amount[0].currency.coinMinimalDenom
      );

      if (denomHelper.type !== "native") {
        if (denomHelper.type === "cw20") {
          // Probably, the gas can be different per cw20 according to how the contract implemented.
          return `${denomHelper.type}/${denomHelper.contractAddress}`;
        }

        return denomHelper.type;
      }
    }

    return "native";
  }, [sendConfigs.amountConfig.amount[0].currency]);

  const gasSimulator = useGasSimulator(
    new ExtensionKVStore("gas-simulator.main.send"),
    chainStore,
    current.chainId,
    sendConfigs.gasConfig,
    sendConfigs.feeConfig,
    gasSimulatorKey,
    () => {
      if (!sendConfigs.amountConfig.amount[0].currency) {
        throw new Error("Send currency not set");
      }

      // Prefer not to use the gas config or fee config,
      // because gas simulator can change the gas config and fee config from the result of reaction,
      // and it can make repeated reaction.
      if (
        sendConfigs.amountConfig.uiProperties.error != null ||
        sendConfigs.recipientConfig.uiProperties.error != null
      ) {
        throw new Error("Not ready to simulate tx");
      }

      const denomHelper = new DenomHelper(
        sendConfigs.amountConfig.amount[0].currency.coinMinimalDenom
      );
      // I don't know why, but simulation does not work for secret20
      if (denomHelper.type === "secret20") {
        throw new Error("Simulating secret wasm not supported");
      }

      return accountInfo.makeSendTokenTx(
        sendConfigs.amountConfig.amount[0].toDec().toString(),
        sendConfigs.amountConfig.amount[0].currency,
        sendConfigs.recipientConfig.recipient
      );
    }
  );

  useEffect(() => {
    // To simulate secretwasm, we need to include the signature in the tx.
    // With the current structure, this approach is not possible.
    if (
      sendConfigs.amountConfig.amount[0].currency &&
      new DenomHelper(sendConfigs.amountConfig.amount[0].currency.coinMinimalDenom)
        .type === "secret20"
    ) {
      gasSimulator.forceDisable(
        new Error("Simulating secret20 is not supported")
      );
      sendConfigs.gasConfig.setValue(
        250000
      );
    } else {
      gasSimulator.forceDisable(false);
      gasSimulator.setEnabled(true);
    }
  }, [
    accountInfo.secret.msgOpts.send.secret20.gas,
    gasSimulator,
    sendConfigs.amountConfig.amount[0].currency,
    sendConfigs.gasConfig,
  ]);

  useEffect(() => {
    if (
      sendConfigs.feeConfig.chainInfo.features &&
      sendConfigs.feeConfig.chainInfo.features.includes("terra-classic-fee")
    ) {
      // When considering stability tax for terra classic.
      // Simulation itself doesn't consider the stability tax send.
      // Thus, it always returns fairly lower gas.
      // To adjust this, for terra classic, increase the default gas adjustment
      gasSimulator.setGasAdjustmentValue(1.6);
    }
  }, [gasSimulator, sendConfigs.feeConfig.chainInfo]);

  useEffect(() => {
    if (query.defaultDenom) {
      const currency = current.currencies.find(
        (cur) => cur.coinMinimalDenom === query.defaultDenom
      );

      if (currency) {
        sendConfigs.amountConfig.setCurrency(currency);
      }
    }
  }, [current.currencies, query.defaultDenom, sendConfigs.amountConfig]);

  const isDetachedPage = query.detached === "true";

  useEffect(() => {
    if (isDetachedPage) {
      fitPopupWindow();
    }
  }, [isDetachedPage]);

  useEffect(() => {
    if (query.defaultRecipient) {
      sendConfigs.recipientConfig.setValue(query.defaultRecipient);
    }
    if (query.defaultAmount) {
      sendConfigs.amountConfig.setValue(query.defaultAmount);
    }
    if (query.defaultMemo) {
      sendConfigs.memoConfig.setValue(query.defaultMemo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.defaultAmount, query.defaultMemo, query.defaultRecipient]);

  const sendConfigError =
    sendConfigs.recipientConfig.uiProperties.error ??
    sendConfigs.amountConfig.uiProperties.error ??
    sendConfigs.memoConfig.uiProperties.error ??
    sendConfigs.gasConfig.uiProperties.error ??
    sendConfigs.feeConfig.uiProperties.error;
  const txStateIsValid = sendConfigError == null;

  return (
    <HeaderLayout
      showChainName
      canChangeChainInfo={false}
      // style={{ height: "auto", minHeight: "100%" }}
      onBackButton={
        isDetachedPage
          ? undefined
          : () => {
              navigate(-1);
            }
      }
      rightRenderer={
        isDetachedPage ? undefined : (
          <div
            style={{
              height: "64px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingRight: "20px",
            }}
          >
            <i
              className="fas fa-external-link-alt"
              style={{
                cursor: "pointer",
                padding: "4px",
                color: "#8B8B9A",
              }}
              onClick={async (e) => {
                e.preventDefault();

                const windowInfo = await browser.windows.getCurrent();

                let queryString = `?detached=true&defaultDenom=${sendConfigs.amountConfig.amount[0].currency.coinMinimalDenom}`;
                if (sendConfigs.recipientConfig.recipient) {
                  queryString += `&defaultRecipient=${sendConfigs.recipientConfig.recipient}`;
                }
                if (sendConfigs.amountConfig.amount) {
                  queryString += `&defaultAmount=${sendConfigs.amountConfig.amount}`;
                }
                if (sendConfigs.memoConfig.memo) {
                  queryString += `&defaultMemo=${sendConfigs.memoConfig.memo}`;
                }

                await openPopupWindow(
                  browser.runtime.getURL(`/popup.html#/send${queryString}`),
                  undefined,
                  {
                    top: (windowInfo.top || 0) + 80,
                    left:
                      (windowInfo.left || 0) +
                      (windowInfo.width || 0) -
                      PopupSize.width -
                      20,
                  }
                );
                window.close();
              }}
            />
          </div>
        )
      }
    >
      <form
        className={style["formContainer"]}
        onSubmit={async (e) => {
          e.preventDefault();

          if (accountInfo.isReadyToSendMsgs && txStateIsValid) {
            try {
              const tx = accountInfo.makeSendTokenTx(
                sendConfigs.amountConfig.amount[0].toDec().toString(),
                sendConfigs.amountConfig.amount[0].currency!,
                sendConfigs.recipientConfig.recipient
              );

              await tx.send(
                sendConfigs.feeConfig.toStdFee(),
                sendConfigs.memoConfig.memo,
                {
                  preferNoSetFee: true,
                  preferNoSetMemo: true,
                  sendTx: async (chainId, tx, mode) => {
                    const msg = new SendTxAndRecordMsg(
                      historyType,
                      chainId,
                      sendConfigs.recipientConfig.chainId,
                      tx,
                      mode,
                      false,
                      sendConfigs.senderConfig.sender,
                      sendConfigs.recipientConfig.recipient,
                      sendConfigs.amountConfig.amount.map((amount) => {
                        return {
                          amount: DecUtils.getTenExponentN(
                            amount.currency.coinDecimals
                          )
                            .mul(amount.toDec())
                            .toString(),
                          denom: amount.currency.coinMinimalDenom,
                        };
                      }),
                      sendConfigs.memoConfig.memo
                    );
                    return await new InExtensionMessageRequester().sendMessage(
                      BACKGROUND_PORT,
                      msg
                    );
                  },
                },
                {
                  onBroadcasted: () => {
                    chainStore.enableVaultsWithCosmosAddress(
                      sendConfigs.recipientConfig.chainId,
                      sendConfigs.recipientConfig.recipient
                    );
                  },
                  onFulfill: (tx: any) => {
                    if (tx.code != null && tx.code !== 0) {
                      console.log(tx.log ?? tx.raw_log);
                      notification.push({
                        type:"danger",
                        placement:"top-center",
                        duration: 5,
                        content: "Transaction Failed",
                        canDelete: true,
                        transition: {
                          duration: 0.25,
                        },
                      });                      return;
                    }
                    notification.push({
                      type:"success",
                      placement:"top-center",
                      duration: 5,
                      content: "Transaction Success",
                      canDelete: true,
                      transition: {
                        duration: 0.25,
                      },
                    });                  },
                }
              );

              if (!isDetachedPage) {
                navigate("/", { replace: true });
              }
            } catch (e) {
              if (!isDetachedPage) {
                navigate("/", { replace: true });
              }
              notification.push({
                type: "warning",
                placement: "top-center",
                duration: 5,
                content: `Fail to send token: ${e.message}`,
                canDelete: true,
                transition: {
                  duration: 0.25,
                },
              });
            } finally {
              // XXX: If the page is in detached state,
              // close the window without waiting for tx to commit. analytics won't work.
              if (isDetachedPage) {
                window.close();
              }
            }
          }
        }}
      >
        <div className={style["formInnerContainer"]}>
          <div>
            <AddressInput
              recipientConfig={sendConfigs.recipientConfig}
              memoConfig={sendConfigs.memoConfig}
              label={intl.formatMessage({ id: "send.input.recipient" })}
              value={""}
            />
            <CoinInput
              amountConfig={sendConfigs.amountConfig}
              label={intl.formatMessage({ id: "send.input.amount" })}
              balanceText={intl.formatMessage({
                id: "send.input-button.balance",
              })}
              disableAllBalance={(() => {
                return sendConfigs.feeConfig.chainInfo.features &&
                  sendConfigs.feeConfig.chainInfo.features.includes(
                    "terra-classic-fee"
                  );

              })()}
              overrideSelectableCurrencies={(() => {
                if (
                  chainStore.current.features &&
                  chainStore.current.features.includes("terra-classic-fee")
                ) {
                  // At present, can't handle stability tax well if it is not registered native token.
                  // So, for terra classic, disable other tokens.
                  const currencies =
                    sendConfigs.amountConfig.selectableCurrencies;
                  return currencies.filter((cur) => {
                    const denom = new DenomHelper(cur.coinMinimalDenom);
                    return !(denom.type !== "native" ||
                      denom.denom.startsWith("ibc/"));
                  });
                }

                return undefined;
              })()}
            />
            <MemoInput
              memoConfig={sendConfigs.memoConfig}
              label={intl.formatMessage({ id: "send.input.memo" })}
            />
            <FeeButtons
              feeConfig={sendConfigs.feeConfig}
              gasConfig={sendConfigs.gasConfig}
              priceStore={priceStore}
              label={intl.formatMessage({ id: "send.input.fee" })}
              feeSelectLabels={{
                low: intl.formatMessage({ id: "fee-buttons.select.low" }),
                average: intl.formatMessage({
                  id: "fee-buttons.select.average",
                }),
                high: intl.formatMessage({ id: "fee-buttons.select.high" }),
              }}
              gasLabel={intl.formatMessage({ id: "send.input.gas" })}
              gasSimulator={gasSimulator}
            />
          </div>
          <div style={{ flex: 1 }} />
          <Button
            type="submit"
            color="primary"
            block
            data-loading={accountInfo.isSendingMsg === "send"}
            disabled={!accountInfo.isReadyToSendMsgs || !txStateIsValid}
            style={{
              marginTop: "12px",
            }}
          >
            {intl.formatMessage({
              id: "send.button.send",
            })}
          </Button>
        </div>
      </form>
    </HeaderLayout>
  );
});
