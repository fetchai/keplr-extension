import { ToolTip } from "@components/tooltip";
import { Staking } from "@keplr-wallet/stores";
import { formatAddress } from "@utils/format";
import React from "react";
import styleValidators from "./validatordetails.module.scss";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../../config.ui.var";

export const URL: { [key in string]: string } = {
  [CHAIN_ID_DORADO]: "https://fetchstation.azoyalabs.com/dorado/validators",
  [CHAIN_ID_FETCHHUB]: "https://fetchstation.azoyalabs.com/mainnet/validators",
};

export const ValidatorDetails = ({
  validator,
  chainID,
}: {
  validator: Staking.Validator;
  chainID: string;
}) => {
  const status = validator.status.split("_")[2].toLowerCase();
  const commisionRate = (
    parseFloat(validator.commission.commission_rates.rate) * 100
  ).toFixed(2);
  const maxCommisionRate = (
    parseFloat(validator.commission.commission_rates.max_rate) * 100
  ).toFixed(2);

  return (
    <div className={styleValidators.item}>
      <div className={styleValidators.title}>
        <div className={styleValidators.label}>
          {validator.description.moniker}
        </div>
        <ToolTip
          trigger="hover"
          options={{ placement: "bottom-start" }}
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
      {validator.description.details && (
        <div
          className={styleValidators.description}
          style={{ borderBottom: "1px solid lightgray" }}
        >
          <span className={styleValidators.label}>Description</span>
          <span>{validator.description.details}</span>
        </div>
      )}
      <div className={styleValidators.details}>
        <div className={styleValidators.col}>
          <span className={styleValidators.label}>Identity</span>
          <span>{validator.description.identity || "Not Provided"}</span>
        </div>
        <div className={styleValidators.col}>
          <span className={styleValidators.label}>Website</span>
          {validator.description.website ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={validator.description.website}
            >
              {validator.description.website}
            </a>
          ) : (
            "Not Provided"
          )}
        </div>
      </div>
      <div className={styleValidators.details}>
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
          <span style={{ textTransform: "capitalize" }}>{status}</span>
        </div>
      </div>
      <a
        href={`${URL[chainID]}/${validator.operator_address}`}
        target="_blank"
        rel="noreferrer"
        style={{ fontSize: "12px" }}
      >
        View in Explorer
      </a>
    </div>
  );
};
