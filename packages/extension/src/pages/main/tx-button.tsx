import React, { FunctionComponent, useCallback, useRef, useState } from "react";

import styleTxButton from "./tx-button.module.scss";

import { Button, Tooltip } from "reactstrap";

import { observer } from "mobx-react-lite";

import { useStore } from "../../stores";

import Modal from "react-modal";

import { useNotification } from "@components/notification";

import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import classnames from "classnames";
import { Dec } from "@keplr-wallet/unit";
import send from "@assets/icon/send.png";

import activeSend from "@assets/icon/activeSend.png";
import { DepositModal } from "./qr-code";
import { WalletStatus } from "@keplr-wallet/stores";

export const TxButtonView: FunctionComponent = observer(() => {
  const { accountStore, chainStore, queriesStore } = useStore();

  const [isActiveSend, setIsActiveSend] = useState(false);

  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);
  const queryBalances = queries.queryBalances.getQueryBech32Address(
    accountInfo.bech32Address
  );

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const [sendTooltipOpen, setSendTooltipOpen] = useState(false);
  const [buyTooltipOpen, setBuyTooltipOpen] = useState(false);

  const history = useHistory();

  const hasAssets =
    queryBalances.balances.find((bal) => bal.balance.toDec().gt(new Dec(0))) !==
    undefined;

  const intl = useIntl();

  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const buyBtnRef = useRef<HTMLButtonElement>(null);
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

  return (
    <div
      className={styleTxButton.containerTxButton}
      style={{ margin: "0px -2px" }}
    >
      <a
        href={"https://fetch.ai/get-fet/"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (chainStore.current.chainId != "fetchhub-4") {
            e.preventDefault();
          }
        }}
      >
        <Button
          innerRef={buyBtnRef}
          color="primary"
          outline
          className={classnames(styleTxButton.button, {
            disabled: chainStore.current.chainId != "fetchhub-4",
          })}
        >
          <FormattedMessage id="main.account.button.buy" />
        </Button>
      </a>
      {chainStore.current.chainId != "fetchhub-4" ? (
        <Tooltip
          placement="bottom"
          isOpen={buyTooltipOpen}
          target={buyBtnRef}
          toggle={() => setBuyTooltipOpen((value) => !value)}
          fade
        >
          <FormattedMessage id="main.account.button.buy.not-support" />
        </Tooltip>
      ) : null}
      <Button
        className={classnames(styleTxButton.button)}
        color="primary"
        outline
        onClick={async (e) => {
          e.preventDefault();
          await copyAddress(accountInfo.bech32Address);

          setIsDepositModalOpen(true);
        }}
      >
        <FormattedMessage id="main.account.button.deposit" />
      </Button>
      {/*
        "Disabled" property in button tag will block the mouse enter/leave events.
        So, tooltip will not work as expected.
        To solve this problem, don't add "disabled" property to button tag and just add "disabled" class manually.
       */}
      <Button
        innerRef={sendBtnRef}
        className={styleTxButton.button}
        style={
          !hasAssets
            ? {
                opacity: 0.5,
                pointerEvents: "none",
              }
            : { opacity: 1, pointerEvents: "auto" }
        }
        color="primary"
        outline
        data-loading={accountInfo.isSendingMsg === "send"}
        onClick={(e) => {
          e.preventDefault();

          if (hasAssets) {
            history.push("/send");
          }
        }}
        onMouseEnter={() => {
          setIsActiveSend(true);
        }}
        onMouseLeave={() => {
          setIsActiveSend(false);
        }}
      >
        <img
          src={isActiveSend ? activeSend : send}
          alt=""
          style={{
            marginRight: "5px",
            height: "15px",
          }}
        />
        <FormattedMessage id="main.account.button.send" />
      </Button>
      {!hasAssets ? (
        <Tooltip
          placement="bottom"
          isOpen={sendTooltipOpen}
          target={sendBtnRef}
          toggle={() => setSendTooltipOpen((value) => !value)}
          fade
        >
          <FormattedMessage id="main.account.tooltip.no-asset" />
        </Tooltip>
      ) : null}
      <Modal
        style={{
          content: {
            width: "330px",
            minWidth: "330px",
            minHeight: "unset",
            maxHeight: "unset",
          },
        }}
        isOpen={isDepositModalOpen}
        onRequestClose={() => {
          setIsDepositModalOpen(false);
        }}
      >
        <DepositModal
          chainName={chainStore.current.chainName}
          bech32Address={accountInfo.bech32Address}
          isDepositOpen={isDepositModalOpen}
          setIsDepositOpen={setIsDepositModalOpen}
        />
      </Modal>
    </div>
  );
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
