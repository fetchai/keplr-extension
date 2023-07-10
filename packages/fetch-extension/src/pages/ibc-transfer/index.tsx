import React, { FunctionComponent, useState } from "react";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "@layouts/index";
import { useNavigate } from "react-router";

import style from "./style.module.scss";
import { Alert, Button } from "reactstrap";
import {
  AddressInput,
  CoinInput,
  FeeButtons,
  MemoInput,
  DestinationChainSelector,
} from "@components/form";
import {
  IAmountConfig,
  IFeeConfig,
  IGasConfig,
  IGasSimulator,
  IIBCChannelConfig,
  IMemoConfig,
  IRecipientConfig, ISenderConfig,
  useGasSimulator,
  useIBCTransferConfig
} from "@keplr-wallet/hooks";
import { useStore } from "../../stores";
import { useNotification } from "@components/notification";
import { FormattedMessage, useIntl } from "react-intl";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { InitialGas } from "../../config.ui";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { SendTxAndRecordMsg } from "@keplr-wallet/background";
import { DecUtils } from "@keplr-wallet/unit";

export const IBCTransferPage: FunctionComponent = observer(() => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<"channel" | "amount">("channel");

  const {
    chainStore,
    accountStore,
    queriesStore,
    uiConfigStore,
  } = useStore();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);

  const notification = useNotification();

  const ibcTransferConfigs = useIBCTransferConfig(
    chainStore,
    queriesStore,
    chainStore.current.chainId,
    accountInfo.bech32Address,
    InitialGas,
    {
      allowHexAddressOnEthermint: true,
      icns: uiConfigStore.icnsInfo,
    }
  );
  const gasSimulator = useGasSimulator(
    new ExtensionKVStore("gas-simulator.ibc.transfer"),
    chainStore,
    chainStore.current.chainId,
    ibcTransferConfigs.gasConfig,
    ibcTransferConfigs.feeConfig,
    "native",
    () => {
      if (!ibcTransferConfigs.channelConfig.channel) {
        throw new Error("Channel not set yet");
      }

      // Prefer not to use the gas config or fee config,
      // because gas simulator can change the gas config and fee config from the result of reaction,
      // and it can make repeated reaction.
      if (
        ibcTransferConfigs.amountConfig.uiProperties.error != null ||
        ibcTransferConfigs.recipientConfig.uiProperties.error != null
      ) {
        throw new Error("Not ready to simulate tx");
      }

      return accountInfo.cosmos.makeIBCTransferTx(
        ibcTransferConfigs.channelConfig.channel,
        ibcTransferConfigs.amountConfig.amount[0].toDec().toString(),
        ibcTransferConfigs.amountConfig.amount[0].currency,
        ibcTransferConfigs.recipientConfig.recipient
      );
    }
  );

  const historyType = "ibc-transfer";

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      {phase === "channel" ? (
        <IBCTransferPageChannel
          channelConfig={ibcTransferConfigs.channelConfig}
          recipientConfig={ibcTransferConfigs.recipientConfig}
          memoConfig={ibcTransferConfigs.memoConfig}
          onNext={() => {
            setPhase("amount");
          }}
        />
      ) : null}
      {phase === "amount" ? (
        <IBCTransferPageAmount
          amountConfig={ibcTransferConfigs.amountConfig}
          senderConfig={ibcTransferConfigs.senderConfig}
          feeConfig={ibcTransferConfigs.feeConfig}
          gasConfig={ibcTransferConfigs.gasConfig}
          gasSimulator={gasSimulator}
          onSubmit={async () => {
            if (ibcTransferConfigs.channelConfig.channel) {
              try {
                const tx = accountInfo.cosmos.makeIBCTransferTx(
                  ibcTransferConfigs.channelConfig.channel,
                  ibcTransferConfigs.amountConfig.amount[0].toDec().toString(),
                  ibcTransferConfigs.amountConfig.amount[0].currency,
                  ibcTransferConfigs.recipientConfig.recipient
                );

                await tx.send(
                  ibcTransferConfigs.feeConfig.toStdFee(),
                  ibcTransferConfigs.memoConfig.memo,
                  {
                    preferNoSetFee: true,
                    preferNoSetMemo: true,
                    sendTx: async (chainId, tx, mode) => {
                      const msg = new SendTxAndRecordMsg(
                        historyType,
                        chainId,
                        ibcTransferConfigs.recipientConfig.chainId,
                        tx,
                        mode,
                        false,
                        ibcTransferConfigs.senderConfig.sender,
                        ibcTransferConfigs.recipientConfig.recipient,
                        ibcTransferConfigs.amountConfig.amount.map((amount) => {
                          return {
                            amount: DecUtils.getTenExponentN(
                              amount.currency.coinDecimals
                            )
                              .mul(amount.toDec())
                              .toString(),
                            denom: amount.currency.coinMinimalDenom,
                          };
                        }),
                        ibcTransferConfigs.memoConfig.memo
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
                        ibcTransferConfigs.recipientConfig.chainId,
                        ibcTransferConfigs.recipientConfig.recipient
                      );
                    },
                    onFulfill: (tx) => {
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
                        });
                        return;
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
                      });
                    },
                  }
                );

                navigate("/");
              } catch (e) {
                navigate("/", { replace: true });
                notification.push({
                  type: "warning",
                  placement: "top-center",
                  duration: 5,
                  content: `Fail to transfer token: ${e.message}`,
                  canDelete: true,
                  transition: {
                    duration: 0.25,
                  },
                });
              }
            }
          }}
        />
      ) : null}
    </HeaderLayout>
  );
});

export const IBCTransferPageChannel: FunctionComponent<{
  channelConfig: IIBCChannelConfig;
  recipientConfig: IRecipientConfig;
  memoConfig: IMemoConfig;
  onNext: () => void;
}> = observer(({ channelConfig, recipientConfig, memoConfig, onNext }) => {
  const intl = useIntl();
  const isValid =
    channelConfig.error == null &&
    recipientConfig.uiProperties.error == null &&
    memoConfig.uiProperties.error == null;

  const isChannelSet = channelConfig.channel != null;

  return (
    <form className={style["formContainer"]}>
      <div className={style["formInnerContainer"]}>
        <DestinationChainSelector ibcChannelConfig={channelConfig} />
        <AddressInput
          label={intl.formatMessage({
            id: "send.input.recipient",
          })}
          recipientConfig={recipientConfig}
          memoConfig={memoConfig}
          ibcChannelConfig={channelConfig}
          disabled={!isChannelSet}
          value={""}
        />
        <MemoInput
          label={intl.formatMessage({
            id: "send.input.memo",
          })}
          memoConfig={memoConfig}
          disabled={!isChannelSet}
        />
        <div style={{ flex: 1 }} />
        <Alert className={style["alert"]}>
          <i className="fas fa-exclamation-circle" />
          <div>
            <h1>IBC is production ready</h1>
            <p>
              However, all new technologies should be used with caution. We
              recommend only transferring small amounts.
            </p>
          </div>
        </Alert>
        <Button
          type="submit"
          color="primary"
          block
          disabled={!isValid}
          onClick={(e) => {
            e.preventDefault();

            onNext();
          }}
        >
          <FormattedMessage id="ibc.transfer.next" />
        </Button>
      </div>
    </form>
  );
});

export const IBCTransferPageAmount: FunctionComponent<{
  amountConfig: IAmountConfig;
  senderConfig: ISenderConfig;
  feeConfig: IFeeConfig;
  gasConfig: IGasConfig;
  gasSimulator?: IGasSimulator;
  onSubmit: () => void;
}> = observer(
  ({ amountConfig, senderConfig, feeConfig, gasConfig, gasSimulator, onSubmit }) => {
    const intl = useIntl();
    const { accountStore, chainStore, priceStore } = useStore();

    const accountInfo = accountStore.getAccount(chainStore.current.chainId);

    const isValid =
      amountConfig.uiProperties.error == null &&
      feeConfig.uiProperties.error == null &&
      gasConfig.uiProperties.error == null;

    return (
      <form className={style["formContainer"]}>
        <div className={style["formInnerContainer"]}>
          <CoinInput
            label={intl.formatMessage({
              id: "send.input.amount",
            })}
            senderConfig={senderConfig}
            amountConfig={amountConfig}
          />
          <div style={{ flex: 1 }} />
          <FeeButtons
            label={intl.formatMessage({
              id: "send.input.fee",
            })}
            senderConfig={senderConfig}
            feeConfig={feeConfig}
            gasConfig={gasConfig}
            priceStore={priceStore}
            gasSimulator={gasSimulator}
          />
          <Button
            type="submit"
            color="primary"
            block
            disabled={!isValid}
            data-loading={accountInfo.isSendingMsg === "ibcTransfer"}
            onClick={(e) => {
              e.preventDefault();

              onSubmit();
            }}
            style={{
              marginTop: "12px",
            }}
          >
            <FormattedMessage id="ibc.transfer.submit" />
          </Button>
        </div>
      </form>
    );
  }
);
