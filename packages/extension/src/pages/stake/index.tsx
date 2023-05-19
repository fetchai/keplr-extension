import searchIcon from "@assets/icon/search.png";
import { Staking } from "@keplr-wallet/stores";
import { HeaderLayout } from "@layouts/header-layout";
import classnames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStore } from "../../stores";
import "./stake.scss";
import { ValidatorCard } from "./validator-card";

export const Validators: FunctionComponent = observer(() => {
  const history = useHistory();

  const [validators, setValidators] = useState<
    { [key in string]: Staking.Validator }
  >({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<string>();
  const { chainStore, queriesStore } = useStore();
  const queries = queriesStore.get(chainStore.current.chainId);

  useEffect(() => {
    const fetchValidators = async () => {
      setLoading(true);
      const bondedValidators = await queries.cosmos.queryValidators
        .getQueryStatus(Staking.BondStatus.Bonded)
        .waitFreshResponse();
      const unbondingValidators = await queries.cosmos.queryValidators
        .getQueryStatus(Staking.BondStatus.Unbonding)
        .waitFreshResponse();
      const unbondedValidators = await queries.cosmos.queryValidators
        .getQueryStatus(Staking.BondStatus.Unbonded)
        .waitFreshResponse();

      const map: { [key in string]: Staking.Validator } = {};
      for (const val of [
        ...(bondedValidators?.data.validators || []),
        ...(unbondingValidators?.data.validators || []),
        ...(unbondedValidators?.data.validators || []),
      ]) {
        map[val.operator_address] = val;
      }
      setValidators(map);
      setLoading(false);
    };
    fetchValidators();
  }, [queries.cosmos.queryValidators]);

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
      onBackButton={() => history.goBack()}
    >
      <p className={classnames("h2", "my-0", "font-weight-normal")}>
        Validators
      </p>
      <div className="searchContainer">
        <div className="searchBox">
          <img draggable={false} src={searchIcon} alt="search" />
          <input
            placeholder="Search by Validator name or address"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "110px 0px",
          }}
        >
          <div className="loader">
            <svg viewBox="0 0 80 80">
              <rect x="8" y="8" width="64" height="64" />
            </svg>
          </div>
          <br />
          Loading Validators
        </div>
      ) : (
        Object.values(validators)
          .filter((validator) =>
            searchInput?.trim().length
              ? validator.description.moniker
                  ?.toLowerCase()
                  .includes(searchInput.toLowerCase()) ||
                validator.operator_address
                  ?.toLowerCase()
                  .includes(searchInput.toLowerCase())
              : true
          )
          .map((validator: Staking.Validator) => (
            <ValidatorCard
              validator={validator}
              key={validator.operator_address}
            />
          ))
      )}
    </HeaderLayout>
  );
});
