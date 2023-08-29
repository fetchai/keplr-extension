import searchIcon from "@assets/icon/search.png";
import { Staking } from "@keplr-wallet/stores";
import { CoinPretty } from "@keplr-wallet/unit";
import { HeaderLayout } from "@layouts/header-layout";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../../stores";
import style from "./style.module.scss";
import { ValidatorsList } from "./validators";
import { MyValidatorsList } from "./my-validators";

type ValidatorData = Staking.Validator & { amount: CoinPretty };

export const ValidatorList: FunctionComponent = observer(() => {
  const navigate = useNavigate();

  const [validators, setValidators] = useState<{
    [key in string]: ValidatorData;
  }>({});
  const [filteredValidators, setFilteredValidators] = useState<ValidatorData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<string>("validator");
  const { chainStore, queriesStore, accountStore } = useStore();
  const queries = queriesStore.get(chainStore.current.chainId);
  const account = accountStore.getAccount(chainStore.current.chainId);
  const queryDelegations =
    queries.cosmos.queryDelegations.getQueryBech32Address(
      account.bech32Address
    );
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

      const map: {
        [key in string]: ValidatorData;
      } = {};
      for (const val of [
        ...(bondedValidators?.data.validators || []),
        ...(unbondingValidators?.data.validators || []),
        ...(unbondedValidators?.data.validators || []),
      ]) {
        const amount = queryDelegations.getDelegationTo(val.operator_address);

        map[val.operator_address] = { ...val, amount };
      }
      setValidators(map);
      setFilteredValidators(Object.values(map));
      setLoading(false);
    };
    fetchValidators();
  }, [queries.cosmos.queryValidators, queryDelegations]);

  const handleFilterValidators = (searchValue: string) => {
    const filteredValidators = Object.values(validators).filter((validator) =>
      searchValue?.trim().length
        ? validator.description.moniker
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          validator.operator_address
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
        : true
    );
    setFilteredValidators(filteredValidators);
    setSearchInput(searchValue);
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
      onBackButton={() => navigate("/")}
    >
      <div className={style["tabList"]}>
        <div
          className={style["tab"]}
          style={{
            borderBottom: selectedTab == "validator" ? "2px solid #D43BF6" : "",
            color: selectedTab == "validator" ? "#D43BF6" : "#000000",
          }}
          onClick={() => setSelectedTab("validator")}
        >
          Validators
        </div>

        <div
          className={style["tab"]}
          style={{
            borderBottom: selectedTab == "myStake" ? "2px solid #3B82F6" : "",
            color: selectedTab == "myStake" ? "#3B82F6" : "#000000",
          }}
          onClick={() => setSelectedTab("myStake")}
        >
          My Stake
        </div>
      </div>
      <div className={style["searchContainer"]}>
        <div className={style["searchBox"]}>
          <img draggable={false} src={searchIcon} alt="search" />
          <input
            placeholder="Search by Validator name or address"
            value={searchInput}
            disabled={loading}
            onChange={(e) => handleFilterValidators(e.target.value)}
          />
        </div>
      </div>
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "110px 0px",
          }}
        >
          <div className={style["loader"]}>
            <svg viewBox="0 0 80 80">
              <rect x="8" y="8" width="64" height="64" />
            </svg>
          </div>
          <br />
          Loading Validators
        </div>
      )}

      {!loading && selectedTab === "validator" && (
        <ValidatorsList filteredValidators={filteredValidators} />
      )}
      {!loading && selectedTab === "myStake" && (
        <MyValidatorsList filteredValidators={filteredValidators} />
      )}
    </HeaderLayout>
  );
});
