import React, { FunctionComponent, ReactElement, useState } from "react";

import classnames from "classnames";
import styleCoinInput from "./coin-input.module.scss";

import { useIBCTransferConfig, useSendTxConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { FormattedMessage } from "react-intl";
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
} from "reactstrap";
import { useStore } from "../../../stores";
import { deliverMessages } from "@graphQL/messages-api";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { userDetails } from "@chatStore/user-slice";
import { useNotification } from "@components/notification";
import { InitialGas } from "../../../config.ui";
import { AppCurrency } from "@keplr-wallet/types";

export const TokenDropdown: FunctionComponent<{
  label: ReactElement<any>[];
  disabled: boolean;
  ibc?: boolean;
}> = observer(({ label, disabled, ibc }) => {
  const { accountStore, chainStore, queriesStore, uiConfigStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const navigate = useNavigate();
  const targetAddress = useLocation().pathname.split("/")[3];
  const notification = useNotification();
  const user = useSelector(userDetails);
  const sendConfigs = useSendTxConfig(
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

  const { amountConfig, senderConfig } = ibc ? ibcTransferConfigs : sendConfigs;
  const queryBalances = queriesStore
    .get(amountConfig.chainId)
    .queryBalances.getQueryBech32Address(senderConfig.sender);

  const [randomId] = useState(() => {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return Buffer.from(bytes).toString("hex");
  });

  const [isOpenTokenSelector, setIsOpenTokenSelector] = useState(false);

  const selectableCurrencies = amountConfig.selectableCurrencies
    .filter((cur) => {
      const bal = queryBalances.getBalanceFromCurrency(cur);
      return !bal.toDec().isZero();
    })
    .sort((a: AppCurrency, b: AppCurrency) => {
      return a.coinDenom < b.coinDenom ? -1 : 1;
    });

  const sendTokenDetails = async () => {
    const messagePayload = {
      token: amountConfig.currency,
      message: `Selected Token: ${amountConfig.currency.coinDenom}`,
    };
    try {
      await deliverMessages(
        user.accessToken,
        current.chainId,
        messagePayload,
        accountInfo.bech32Address,
        targetAddress
      );
    } catch (e) {
      console.log(e);
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: `Failed to send selected Token`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
    }
  };

  const cancel = async () => {
    try {
      await deliverMessages(
        user.accessToken,
        current.chainId,
        "/cancel",
        accountInfo.bech32Address,
        targetAddress
      );
    } catch (e) {
      console.log(e);
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: `Failed to cancel Operation`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
    }
  };

  return (
    <React.Fragment>
      <FormGroup>
        <Label for={`selector-${randomId}`} style={{ width: "100%" }}>
          {label || (
            <FormattedMessage id="component.form.coin-input.token.label" />
          )}
        </Label>
        <ButtonDropdown
          id={`selector-${randomId}`}
          className={classnames(styleCoinInput["tokenSelector"], {
            disabled: amountConfig.fraction === 1 || disabled,
          })}
          isOpen={isOpenTokenSelector}
          toggle={() => setIsOpenTokenSelector((value) => !value)}
          disabled={amountConfig.fraction === 1 || disabled}
        >
          <DropdownToggle caret>
            {amountConfig.currency.coinDenom}
          </DropdownToggle>
          <DropdownMenu>
            {selectableCurrencies.map((currency) => {
              return (
                <DropdownItem
                  key={currency.coinMinimalDenom}
                  active={
                    currency.coinMinimalDenom ===
                    amountConfig.currency.coinMinimalDenom
                  }
                  onClick={(e) => {
                    e.preventDefault();

                    amountConfig.setCurrency(currency);
                  }}
                >
                  {currency.coinDenom}
                </DropdownItem>
              );
            })}
            {!ibc && (
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault();
                  navigate({
                    pathname: "/setting/token/add",
                    hash: "agent",
                  });
                }}
              >
                <i className="fas fa-plus-circle my-1 mr-1" /> Add a token
              </DropdownItem>
            )}
          </DropdownMenu>
        </ButtonDropdown>
        <Button
          type="button"
          color="primary"
          size="sm"
          style={{ marginTop: "15px" }}
          disabled={disabled}
          onClick={() => sendTokenDetails()}
        >
          Proceed
        </Button>
        <Button
          type="button"
          color="secondary"
          size="sm"
          style={{ marginTop: "15px" }}
          disabled={disabled}
          onClick={() => cancel()}
        >
          Cancel
        </Button>
      </FormGroup>
    </React.Fragment>
  );
});
