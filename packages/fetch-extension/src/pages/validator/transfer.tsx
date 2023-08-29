import activeStake from "@assets/icon/activeStake.png";
import { useNotification } from "@components/notification";
import {
  EmptyAmountError,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError,
  useRedelegateTxConfig,
} from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { Staking } from "@keplr-wallet/stores";

export const Transfer: FunctionComponent<{
  validatorAddress: string;
  validatorsList: Staking.Validator[];
}> = observer(({ validatorAddress, validatorsList }) => {
  const navigate = useNavigate();
  const { chainStore, accountStore, queriesStore } = useStore();
  const account = accountStore.getAccount(chainStore.current.chainId);
  const [selectedValidator, setSelectedValidator] = useState<Staking.Validator>(
    validatorsList[0]
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const sendConfigs = useRedelegateTxConfig(
    chainStore,
    queriesStore,
    accountStore,
    chainStore.current.chainId,
    account.bech32Address,
    validatorAddress
  );
  const { amountConfig, memoConfig, feeConfig } = sendConfigs;

  const intl = useIntl();
  const error = amountConfig.error;

  const balance = queriesStore
    .get(amountConfig.chainId)
    .cosmos.queryDelegations.getQueryBech32Address(amountConfig.sender)
    .getDelegationTo(validatorAddress);

  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        case EmptyAmountError:
          // No need to show the error to user.
          return;
        case InvalidNumberAmountError:
          return intl.formatMessage({
            id: "input.amount.error.invalid-number",
          });
        case ZeroAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-zero",
          });
        case NegativeAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-negative",
          });
        case InsufficientAmountError:
          return intl.formatMessage({
            id: "input.amount.error.insufficient",
          });
        default:
          return intl.formatMessage({ id: "input.amount.error.unknown" });
      }
    }
  }, [intl, error]);

  const notification = useNotification();
  const stakeClicked = async () => {
    try {
      await account.cosmos.sendBeginRedelegateMsg(
        amountConfig.amount,
        validatorAddress,
        selectedValidator.operator_address,
        memoConfig.memo,
        feeConfig.toStdFee(),
        undefined,
        {
          onBroadcasted: () => {
            notification.push({
              type: "primary",
              placement: "top-center",
              duration: 2,
              content: `Transaction broadcasted`,
              canDelete: true,
              transition: {
                duration: 0.25,
              },
            });
          },
          onFulfill: () => {
            notification.push({
              type: "success",
              placement: "top-center",
              duration: 5,
              content: `Transaction Completed`,
              canDelete: true,
              transition: {
                duration: 0.25,
              },
            });
          },
        }
      );
      navigate("/stake-complete/" + selectedValidator.operator_address);
    } catch (e) {
      notification.push({
        type: "danger",
        placement: "top-center",
        duration: 5,
        content: `Transaction Failed`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      navigate("/", { replace: true });
    }
  };

  return (
    <React.Fragment>
      <FormGroup style={{ borderRadius: "0%", marginBottom: "2px" }}>
        <Label className="form-control-label" style={{ marginTop: "10px" }}>
          Select Validator
        </Label>
        <ButtonDropdown
          isOpen={showDropdown}
          toggle={() => setShowDropdown((value) => !value)}
          style={{ float: "right" }}
        >
          <DropdownToggle caret style={{ boxShadow: "none" }}>
            {selectedValidator.description.moniker}
          </DropdownToggle>

          <DropdownMenu>
            <div style={{ height: "400px", overflowY: "scroll" }}>
              {validatorsList.map((validator) => {
                return (
                  <DropdownItem
                    key={validator.operator_address}
                    onClick={() => {
                      setSelectedValidator(validator);
                    }}
                  >
                    {validator.description.moniker}
                  </DropdownItem>
                );
              })}
            </div>
          </DropdownMenu>
        </ButtonDropdown>
        <Label
          className="form-control-label"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <div
            className={style["balance"]}
            onClick={(e) => {
              e.preventDefault();

              amountConfig.toggleIsMax();
            }}
          >{`Balance: ${balance.trim(true).maxDecimals(18).toString()}`}</div>
        </Label>
        <Input
          className="form-control-alternative"
          type="number"
          value={amountConfig.amount}
          placeholder="0 FET"
          onChange={(e) => {
            e.preventDefault();
            amountConfig.setAmount(e.target.value);
          }}
          style={{ borderRadius: "0%" }}
          min={0}
          autoComplete="off"
        />
        {errorText != null ? (
          <div className={style["errorText"]}>{errorText}</div>
        ) : null}

        <Button
          type="submit"
          color="primary"
          block
          disabled={errorText != null || !amountConfig.amount}
          style={{ alignItems: "end", marginTop: "10px" }}
          onClick={stakeClicked}
        >
          <img
            src={activeStake}
            alt=""
            style={{
              marginRight: "5px",
              height: "15px",
            }}
          />
          Transfer
        </Button>
      </FormGroup>
    </React.Fragment>
  );
});
