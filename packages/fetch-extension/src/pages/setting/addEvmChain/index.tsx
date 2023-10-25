import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button } from "reactstrap";
import { Input } from "@components/form";
import style from "./style.module.scss";
import { useStore } from "../../../stores";
import { Bech32Address } from "@keplr-wallet/cosmos";
import axios from "axios";
import { useLoadingIndicator } from "@components/loading-indicator";

export const AddEvmChain: FunctionComponent = () => {
  const navigate = useNavigate();
  const { chainStore } = useStore();
  const [hasErrors, setHasErrors] = useState(false);
  const [info, setInfo] = useState("");
  const loadingIndicator = useLoadingIndicator();

  // const [chainIdMsg, setChainIdMsg] = useState("");
  const initialState = {
    chainName: "",
    rpc: "",
    rest: "",
    chainId: "",
    symbol: "",
    stakeCurrency: {
      coinDenom: "",
      coinMinimalDenom: "",
      coinDecimals: 0,
    },
    bip44: {
      coinType: 60,
    },
    bech32Config: Bech32Address.defaultBech32Config("fetch"),
    currencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 0,
        // coinGeckoId: "",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 0,

        gasPriceStep: {
          low: 10000000000,
          average: 10000000000,
          high: 10000000000,
        },
      },
    ],
    features: ["evm"],
  };
  const [newChainInfo, setNewChainInfo] = useState(initialState);

  const getChainInfo = async (rpcUrl: string) => {
    loadingIndicator.setIsLoading("chain-details", true);
    try {
      const chains = await axios.get("https://chainid.network/chains.json");
      const response = await axios.post(
        rpcUrl,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_chainId",
          params: [],
        },
        { timeout: 5000 }
      );

      if (response.status === 200 && chains.status === 200) {
        const data = response.data;
        const chainId = parseInt(data.result, 16);
        const chainData = chains.data.find(
          (element: any) => chainId === element.chainId
        );

        if (chainData) {
          setInfo("We've fetched information based on the provided RPC.");
          const symbol = chainData.nativeCurrency.symbol;
          setNewChainInfo({
            ...newChainInfo,
            currencies: [
              {
                coinDenom: symbol,
                coinMinimalDenom: symbol,
                coinDecimals: chainData.nativeCurrency.decimals,
              },
            ],
            symbol: symbol,
            rpc: rpcUrl,
            rest: rpcUrl,
            chainId: chainData.chainId.toString(),
            chainName: chainData.name,
            bech32Config: Bech32Address.defaultBech32Config(
              symbol.toLowerCase()
            ),
          });
        }
      }
    } catch (error) {
      setNewChainInfo({ ...initialState, rpc: rpcUrl });
      setInfo(
        "We could not fetch chain details, please enter the chain details manually"
      );
    } finally {
      loadingIndicator.setIsLoading("chain-details", false);
    }
  };

  useEffect(() => {
    const symbol = newChainInfo.symbol;
    newChainInfo.stakeCurrency.coinDecimals =
      newChainInfo.currencies[0].coinDecimals;
    newChainInfo.stakeCurrency.coinDenom = symbol;
    newChainInfo.stakeCurrency.coinMinimalDenom = symbol;
    newChainInfo.feeCurrencies[0].coinDecimals =
      newChainInfo.currencies[0].coinDecimals;
    newChainInfo.feeCurrencies[0].coinDenom = symbol;
    newChainInfo.feeCurrencies[0].coinMinimalDenom = symbol;
    newChainInfo.bech32Config = Bech32Address.defaultBech32Config(
      symbol.toLowerCase()
    );
  }, [newChainInfo]);

  const isUrlValid = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo("");
    const { name, value } = e.target;
    setHasErrors(false);
    // suggestValid(name, value);

    if (name === "rpc") {
      setNewChainInfo({ ...newChainInfo, rpc: value });

      if (isUrlValid(value)) {
        await getChainInfo(value);
      }
    } else if (name === "decimal") {
      setNewChainInfo({
        ...newChainInfo,
        currencies: [
          {
            ...newChainInfo.currencies[0],
            coinDecimals: parseInt(value),
          },
        ],
      });
    } else {
      setNewChainInfo({
        ...newChainInfo,
        [name]: value,
      });
    }
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
        <Input
          label="RPC URL"
          type="text"
          name="rpc"
          value={newChainInfo.rpc}
          onChange={handleChange}
          required
        />
        {info && (
          <p
            style={{
              color: "#567965",
              fontSize: "12px",
              marginTop: "-22px",
            }}
          >
            {info}
          </p>
        )}
        <Input
          label="Network Name"
          type="text"
          name="chainName"
          value={newChainInfo.chainName}
          onChange={handleChange}
          required
        />
        <Input
          label="Chain id"
          type="text"
          name="chainId"
          value={newChainInfo.chainId}
          onChange={handleChange}
          required
        />
        {/* {chainIdMsg && (
        <Label
          style={{
            color: "#567965",
            fontSize: "15px",
          }}
        >
          {chainIdMsg}
        </Label>
      )} */}
        <Input
          label="Symbol"
          type="text"
          name="symbol"
          value={newChainInfo.symbol}
          onChange={handleChange}
          required
        />
        <Input
          label="Decimal"
          type="number"
          name="decimal"
          value={newChainInfo.currencies[0].coinDecimals}
          onChange={handleChange}
          required
        />
        <Button
          text="Add Chain"
          color="primary"
          block
          disabled={hasErrors}
          type="submit"
        >
          {hasErrors ? "Chain id already exist" : "Add Chain"}
        </Button>
      </Form>
    </HeaderLayout>
  );
};
