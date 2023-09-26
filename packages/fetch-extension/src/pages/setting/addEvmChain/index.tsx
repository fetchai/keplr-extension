import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button } from "reactstrap";
import style from "./style.module.scss";
import { useStore } from "../../../stores";
import { Bech32Address } from "@keplr-wallet/cosmos";

export const AddEvmChain: FunctionComponent = () => {
  const navigate = useNavigate();
  const { chainStore } = useStore();
  const [hasErrors, setHasErrors] = useState(false);
  const initialState = {
    chainName: "",
    rpc: "",
    rest: "",
    chainId: "",
    symbol: "",
    stakeCurrency: {
      coinDenom: "",
      coinMinimalDenom: "",
      coinDecimals: 18,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("fetch"),
    currencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 18,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 18,

        gasPriceStep: {
          low: 3000000000,
          average: 3000000000,
          high: 3000000000,
        },
      },
    ],
    features: ["evm"],
  };
  const [newChainInfo, setNewChainInfo] = useState(initialState);

  useEffect(() => {
    const symbolLower = newChainInfo.symbol.toLowerCase();
    const symbolUpper = newChainInfo.symbol.toUpperCase();
    const coinDecimals = newChainInfo.currencies[0].coinDecimals;

    newChainInfo.rest = newChainInfo.rpc;
    newChainInfo.currencies[0].coinDenom = symbolUpper;
    newChainInfo.currencies[0].coinDenom = symbolUpper;
    newChainInfo.currencies[0].coinMinimalDenom = symbolLower;
    newChainInfo.stakeCurrency.coinDecimals = coinDecimals;
    newChainInfo.stakeCurrency.coinDenom = symbolUpper;
    newChainInfo.stakeCurrency.coinMinimalDenom = symbolLower;
    newChainInfo.feeCurrencies[0].coinDecimals = coinDecimals;
    newChainInfo.feeCurrencies[0].coinDenom = symbolUpper;
    newChainInfo.feeCurrencies[0].coinMinimalDenom = symbolLower;
    newChainInfo.bech32Config = Bech32Address.defaultBech32Config(symbolLower);
  }, [
    newChainInfo.rpc,
    newChainInfo.symbol,
    newChainInfo.currencies[0].coinDecimals,
  ]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setHasErrors(false);
    setNewChainInfo({
      ...newChainInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (chainStore.hasChain(newChainInfo.chainId)) {
      setNewChainInfo(initialState);
      setHasErrors(true);
    }

    try {
      chainStore.addEVMChainInfo(newChainInfo);
      chainStore.selectChain(newChainInfo.chainId);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"Add new EVM chain"}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      <Form onSubmit={handleSubmit} className={style["container"]}>
        <div>
          <label>Network Name: </label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="chainName"
            value={newChainInfo.chainName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>RPC URL: </label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="rpc"
            value={newChainInfo.rpc}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Chain ID: </label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="chainId"
            value={newChainInfo.chainId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Symbol: </label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="symbol"
            value={newChainInfo.symbol.toUpperCase()}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Decimal:</label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="number"
            name="decimal"
            value={newChainInfo.currencies[0].coinDecimals}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <Button
          text="Add Chain"
          color={hasErrors ? "danger" : "primary"}
          size="medium"
          style={{ width: "100%" }}
          disabled={hasErrors}
          type="submit"
        >
          {hasErrors ? "Chain id already exist" : "Add Chain"}
        </Button>
      </Form>
    </HeaderLayout>
  );
};
