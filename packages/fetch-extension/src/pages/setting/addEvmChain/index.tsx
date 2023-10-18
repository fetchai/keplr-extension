import { HeaderLayout } from "@layouts/header-layout";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button, Label } from "reactstrap";
import style from "./style.module.scss";
import { useStore } from "../../../stores";
import { Bech32Address } from "@keplr-wallet/cosmos";
import axios from "axios";

export const AddEvmChain: FunctionComponent = () => {
  const navigate = useNavigate();
  const { chainStore } = useStore();
  const [hasErrors, setHasErrors] = useState(false);
  const [info, setInfo] = useState("");
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
      coinDecimals: 12,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: Bech32Address.defaultBech32Config("fetch"),
    currencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 12,
        // coinGeckoId: "",
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "",
        coinMinimalDenom: "",
        coinDecimals: 12,

        gasPriceStep: {
          low: 1000000000,
          average: 2000000000,
          high: 3000000000,
        },
      },
    ],
    features: ["evm"],
  };
  const [newChainInfo, setNewChainInfo] = useState(initialState);

  const getChainInfo = async (rpcUrl: string) => {
    try {
      const chains = await axios.get("https://chainid.network/chains.json");
      const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_chainId",
        params: [],
      });

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
      console.error(
        "Unable to connect with RPC url provided or fetch chains data:",
        error
      );
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo("");
    const { name, value } = e.target;
    setHasErrors(false);
    // suggestValid(name, value);

    if (name === "rpc") {
      setNewChainInfo({ ...newChainInfo, rpc: value });
      await getChainInfo(value);
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
      console.log("check");
      setNewChainInfo({
        ...newChainInfo,
        [name]: value,
      });
    }
  };

  // const suggestValid = (name: string, value: string) => {
  //   // if (name === "symbol" && value !== chainData.symbol) {
  //   // }
  //   if (name === "chainId" && value !== chainData.chainId) {
  //     console.log("checking chainID");
  //     setChainIdMsg(
  //       `The RPC URL you have entered returned a different chain ID ("${chainData.chainId}"). Please update the Chain ID to match the RPC URL of the network you are trying to add.`
  //     );
  //   } else {
  //     setChainIdMsg("");
  //   }
  // };
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
          <Label>RPC URL: </Label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="rpc"
            value={newChainInfo.rpc}
            onChange={handleChange}
            required
          />
        </div>
        {info && (
          <Label
            style={{
              color: "#567965",
              fontSize: "15px",
            }}
          >
            {info}
          </Label>
        )}
        <div>
          <Label>Network Name: </Label>
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
          <Label>Chain ID: </Label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="chainId"
            value={newChainInfo.chainId}
            onChange={handleChange}
            required
          />
        </div>
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
        <div>
          <Label>Symbol: </Label>
          <Input
            formGroupClassName={style["formGroup"]}
            type="text"
            name="symbol"
            value={newChainInfo.symbol}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Decimal:</Label>
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
