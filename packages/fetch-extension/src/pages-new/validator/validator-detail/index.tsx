import React, { useMemo } from "react";
import style from "./style.module.scss";
import { ButtonV2 } from "@components-v2/buttons/button";
import { StakeDetails } from "./stake-details/stake-details";
import { ValidatorData } from "../../../components-v2/validator-data";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";

export const ValidatorDetails = observer(
  ({ validatorAddress }: { validatorAddress: string }) => {
    const navigate = useNavigate();

    const { chainStore, accountStore, queriesStore } = useStore();
    const account = accountStore.getAccount(chainStore.current.chainId);
    const queries = queriesStore.get(chainStore.current.chainId);

    const queryDelegations =
      queries.cosmos.queryDelegations.getQueryBech32Address(
        account.bech32Address
      );

    const { amount } = useMemo(() => {
      const amount = queryDelegations.getDelegationTo(validatorAddress);
      const unbondings = queries.cosmos.queryUnbondingDelegations
        .getQueryBech32Address(account.bech32Address)
        .unbondingBalances.find(
          (unbonding) => unbonding.validatorAddress === validatorAddress
        );
      return {
        amount: amount,
        unbondings: unbondings,
      };
    }, [queryDelegations, validatorAddress]);

    return (
      <div
        className={style["validator-details-container"]}
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
          }}
        >
          <ValidatorData validatorAddress={validatorAddress} />
        </div>

        {amount &&
          parseFloat(
            amount?.maxDecimals(4).trim(true).toString().split(" ")[0]
          ) > 0.00001 && <StakeDetails validatorAddress={validatorAddress} />}

        <div
          className={style["validator-buttons"]}
          // style={{
          //   position: "fixed",
          //   bottom: "15px",
          //   margin: "0 auto",
          //   left: 0,
          //   right: 0,
          //   width: "336px",
          // }}
        >
          {amount &&
            parseFloat(
              amount?.maxDecimals(4).trim(true).toString().split(" ")[0]
            ) > 0.00001 && (
              <ButtonV2
                styleProps={{
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "transparent",
                  color: "white",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "0px",
                }}
                text="Redelegate"
                onClick={() =>
                  navigate(`/validator/${validatorAddress}/redelegate`)
                }
              />
            )}

          <ButtonV2
            styleProps={{
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0px",
            }}
            text={`${
              amount &&
              parseFloat(
                amount?.maxDecimals(4).trim(true).toString().split(" ")[0]
              ) > 0.00001
                ? "Stake"
                : "Stake with this validator"
            }`}
            onClick={() => navigate(`/validator/${validatorAddress}/delegate`)}
          />
        </div>

        {/* {amount &&
          parseFloat(
            amount?.maxDecimals(4).trim(true).toString().split(" ")[0]
          ) > 0.00001 && (
            <div
              style={{
                height: "35px",
                padding: "35px",
              }}
            />
          )} */}
      </div>
    );
  }
);
