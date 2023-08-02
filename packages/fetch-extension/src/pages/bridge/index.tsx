import React, { FunctionComponent, useState } from "react";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "@layouts/index";
import { useNavigate } from "react-router";

import style from "./style.module.scss";
import {
  Button,
  FormGroup,
  Label,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  AddressInput,
  CoinInput,
  FeeButtons,
  MemoInput,
} from "@components/form";
import { useGasSimulator, useIBCTransferConfig } from "@keplr-wallet/hooks";
import { useStore } from "../../stores";
import { useNotification } from "@components/notification";
import { FormattedMessage, useIntl } from "react-intl";
import { ExtensionKVStore } from "@keplr-wallet/common";

export const BridgePage: FunctionComponent = observer(() => {
  const navigate = useNavigate();
  const intl = useIntl();

  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState("");

  const {
    chainStore,
    accountStore,
    queriesStore,
    uiConfigStore,
    analyticsStore,
    priceStore,
  } = useStore();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const bridgeEvmStatus = queriesStore.get(chainStore.current.chainId).evm
    .queryNativeFetBridge.status;
  console.log("@@@@Evm", bridgeEvmStatus);
  const bridgeFetStatus = queriesStore.get(chainStore.current.chainId).cosmwasm
    .queryNativeFetBridge.status;
  console.log("@@@@Fet", bridgeFetStatus);

  const notification = useNotification();

  const ibcTransferConfigs = useIBCTransferConfig(
    chainStore,
    queriesStore,
    accountStore,
    chainStore.current.chainId,
    accountInfo.bech32Address,
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
        ibcTransferConfigs.amountConfig.error != null ||
        ibcTransferConfigs.recipientConfig.error != null
      ) {
        throw new Error("Not ready to simulate tx");
      }

      return accountInfo.cosmos.makeIBCTransferTx(
        ibcTransferConfigs.channelConfig.channel,
        ibcTransferConfigs.amountConfig.amount,
        ibcTransferConfigs.amountConfig.sendCurrency,
        ibcTransferConfigs.recipientConfig.recipient
      );
    }
  );

  const toChainId =
    (ibcTransferConfigs &&
      ibcTransferConfigs.channelConfig &&
      ibcTransferConfigs.channelConfig.channel &&
      ibcTransferConfigs.channelConfig.channel.counterpartyChainId) ||
    "";

  const toChainName =
    (toChainId && chainStore.getChain(toChainId).chainName) || "";

  const isChannelSet = ibcTransferConfigs.channelConfig.channel != null;

  const isValid =
    ibcTransferConfigs.channelConfig.error == null &&
    ibcTransferConfigs.recipientConfig.error == null &&
    ibcTransferConfigs.memoConfig.error == null &&
    ibcTransferConfigs.amountConfig.error == null &&
    ibcTransferConfigs.feeConfig.error == null &&
    ibcTransferConfigs.gasConfig.error == null;

  const onSubmit = async () => {
    if (ibcTransferConfigs.channelConfig.channel) {
      try {
        const tx = accountInfo.cosmos.makeIBCTransferTx(
          ibcTransferConfigs.channelConfig.channel,
          ibcTransferConfigs.amountConfig.amount,
          ibcTransferConfigs.amountConfig.sendCurrency,
          ibcTransferConfigs.recipientConfig.recipient
        );

        await tx.send(
          ibcTransferConfigs.feeConfig.toStdFee(),
          ibcTransferConfigs.memoConfig.memo,
          {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          },
          {
            onBroadcasted: () => {
              analyticsStore.logEvent("Send token tx broadCasted", {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
                feeType: ibcTransferConfigs.feeConfig.feeType,
                isIbc: true,
                toChainId,
                toChainName,
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
  };

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      <form className={style["formContainer"]}>
        <div className={style["formInnerContainer"]}>
          <FormGroup>
            <Label for="chain-dropdown" className="form-control-label">
              <FormattedMessage id="component.ibc.channel-registrar.chain-selector.label" />
            </Label>
            <ButtonDropdown
              id="chain-dropdown"
              className={style["chainSelector"]}
              isOpen={isChainDropdownOpen}
              toggle={() => setIsChainDropdownOpen((value) => !value)}
            >
              <DropdownToggle caret>
                {selectedChainId ? (
                  chainStore.getChain(selectedChainId).chainName
                ) : (
                  <FormattedMessage id="component.ibc.channel-registrar.chain-selector.placeholder" />
                )}
              </DropdownToggle>
              <DropdownMenu
                style={{
                  maxHeight: "95vh",
                  overflowY: "auto",
                }}
              >
                {chainStore.chainInfos.map((chainInfo) => {
                  if (chainStore.current.chainId !== chainInfo.chainId) {
                    if ((chainInfo.features ?? []).includes("ibc-transfer")) {
                      return (
                        <DropdownItem
                          key={chainInfo.chainId}
                          onClick={(e) => {
                            e.preventDefault();

                            setSelectedChainId(chainInfo.chainId);
                          }}
                        >
                          {chainInfo.chainName}
                        </DropdownItem>
                      );
                    }
                  }
                })}
              </DropdownMenu>
            </ButtonDropdown>
          </FormGroup>
          <AddressInput
            label={intl.formatMessage({
              id: "send.input.recipient",
            })}
            recipientConfig={ibcTransferConfigs.recipientConfig}
            memoConfig={ibcTransferConfigs.memoConfig}
            ibcChannelConfig={ibcTransferConfigs.channelConfig}
            disabled={!isChannelSet}
            value={""}
          />
          <MemoInput
            label={intl.formatMessage({
              id: "send.input.memo",
            })}
            memoConfig={ibcTransferConfigs.memoConfig}
            disabled={!isChannelSet}
          />
          <div style={{ flex: 1 }} />

          <CoinInput
            label={intl.formatMessage({
              id: "send.input.amount",
            })}
            amountConfig={ibcTransferConfigs.amountConfig}
          />
          <div style={{ flex: 1 }} />
          <FeeButtons
            label={intl.formatMessage({
              id: "send.input.fee",
            })}
            feeConfig={ibcTransferConfigs.feeConfig}
            gasConfig={ibcTransferConfigs.gasConfig}
            priceStore={priceStore}
            gasSimulator={gasSimulator}
          />

          <Button
            type="submit"
            color="primary"
            block
            disabled={!isValid}
            onClick={(e) => {
              e.preventDefault();

              onSubmit();
            }}
          >
            <FormattedMessage id="ibc.transfer.next" />
          </Button>
        </div>
      </form>
    </HeaderLayout>
  );
});
