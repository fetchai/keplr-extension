import React, { FunctionComponent, useState } from "react";

import classnames from "classnames";
import styleCoinInput from "./coin-input.module.scss";

import { useSendTxConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { FormattedMessage } from "react-intl";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
} from "reactstrap";
import { useStore } from "../../../stores";
import { EthereumEndpoint } from "../../../config.ui";

export const TokenDropdown: FunctionComponent = observer(() => {
  const { accountStore, chainStore, queriesStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);

  const sendConfigs = useSendTxConfig(
    chainStore,
    current.chainId,
    accountInfo.msgOpts.send,
    accountInfo.bech32Address,
    queriesStore.get(current.chainId).queryBalances,
    EthereumEndpoint
  );
  const { amountConfig } = sendConfigs;
  const queryBalances = queriesStore
    .get(amountConfig.chainId)
    .queryBalances.getQueryBech32Address(amountConfig.sender);

  const [randomId] = useState(() => {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return Buffer.from(bytes).toString("hex");
  });

  const [isOpenTokenSelector, setIsOpenTokenSelector] = useState(false);

  const selectableCurrencies = amountConfig.sendableCurrencies
    .filter((cur) => {
      const bal = queryBalances.getBalanceFromCurrency(cur);
      return true || !bal.toDec().isZero();
    })
    .sort((a, b) => {
      return a.coinDenom < b.coinDenom ? -1 : 1;
    });

  return (
    <React.Fragment>
      <FormGroup>
        <Label
          for={`selector-${randomId}`}
          className="form-control-label"
          style={{ width: "100%" }}
        >
          <FormattedMessage id="component.form.coin-input.token.label" />
        </Label>
        <ButtonDropdown
          id={`selector-${randomId}`}
          className={classnames(styleCoinInput.tokenSelector, {
            disabled: amountConfig.isMax,
          })}
          isOpen={isOpenTokenSelector}
          toggle={() => setIsOpenTokenSelector((value) => !value)}
          disabled={amountConfig.isMax}
        >
          <DropdownToggle caret>
            {amountConfig.sendCurrency.coinDenom}
          </DropdownToggle>
          <DropdownMenu>
            {selectableCurrencies.map((currency) => {
              return (
                <DropdownItem
                  key={currency.coinMinimalDenom}
                  active={
                    currency.coinMinimalDenom ===
                    amountConfig.sendCurrency.coinMinimalDenom
                  }
                  onClick={(e) => {
                    e.preventDefault();

                    amountConfig.setSendCurrency(currency);
                  }}
                >
                  {currency.coinDenom}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </ButtonDropdown>
      </FormGroup>
    </React.Fragment>
  );
});
