import { ToolTip } from "@components/tooltip";
import { Staking } from "@keplr-wallet/stores";
import { formatAddress } from "@utils/format";
import React from "react";
import styleValidators from "./validators.module.scss";
import { useHistory } from "react-router";

export const ValidatorCard = ({
  validator,
}: {
  validator: Staking.Validator;
}) => {
  const history = useHistory();

  const status = validator.status.split("_")[2].toLowerCase();
  const commisionRate = (
    parseFloat(validator.commission.commission_rates.rate) * 100
  ).toFixed(2);
  const maxCommisionRate = (
    parseFloat(validator.commission.commission_rates.max_rate) * 100
  ).toFixed(2);

  return (
    <div
      className={styleValidators.item}
      onClick={() =>
        history.push(`/validators/${validator.operator_address}/stake`)
      }
    >
      <div
        className={styleValidators.row}
        style={{ borderBottom: "1px solid lightgray" }}
      >
        <div className={styleValidators.label}>
          {validator.description.moniker}
        </div>
        <ToolTip
          trigger="hover"
          options={{ placement: "bottom" }}
          tooltip={
            <div className={styleValidators.tooltip}>
              {validator.operator_address}
            </div>
          }
        >
          <span className={styleValidators.address}>
            {formatAddress(validator.operator_address)}
          </span>
        </ToolTip>
      </div>
      <div className={styleValidators.row}>
        <div className={styleValidators.col}>
          <span className={styleValidators.label}>Rate</span>
          <span>{commisionRate}%</span>
        </div>
        <div className={styleValidators.col}>
          <span className={styleValidators.label}>Max Rate</span>
          <span>{maxCommisionRate}%</span>
        </div>
        <div className={styleValidators.col}>
          <span className={styleValidators.label}>Status</span>
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
};
