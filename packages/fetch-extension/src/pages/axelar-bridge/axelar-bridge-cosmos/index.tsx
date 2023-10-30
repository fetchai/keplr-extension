/* eslint-disable import/no-extraneous-dependencies */
import {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  LoadAssetConfig,
  loadChains,
} from "@axelar-network/axelarjs-sdk";
import { Input } from "@components/form";
import { HeaderLayout } from "@layouts/header-layout";
import {
  extractNumberFromBalance,
  getEnvironment,
} from "@utils/axl-bridge-utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CHAIN_ID_DORADO } from "../../../config.ui.var";
import { useStore } from "../../../stores";
import { ChainSelect } from "../chain-select";
import { GasAndDetails } from "../gas-and-details";
import { RecipientAddress } from "../recipient-address";
import style from "../style.module.scss";
import { TokenBalances } from "../token-balances";
import { TokenSelect } from "../token-select";
import { GetDepositAddress } from "./get-deposit-address";
import { SendToken } from "./send-token";

export const AxelarBridgeCosmos = observer(() => {
  // to chain list
  const [transferChain, setTransferChain] = useState<any>();
  const [chains, setChains] = useState<any[]>([]);
  const [recieverChain, setRecieverChain] = useState<any>();

  const [transferTokens, setTransferTokens] = useState<any[]>([]);
  const [transferToken, setTransferToken] = useState<any>();

  const [toToken, setToToken] = useState<any>();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState<any>();
  const [amountError, setAmountError] = useState<any>();
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);

  const [tokenBal, setTokenBal] = useState<any>("");

  // UI related state
  const [isChainsLoaded, setIsChainsLoaded] = useState(true);
  const [depositAddress, setDepositAddress] = useState<any>();
  const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);

  const { chainStore } = useStore();
  const current = chainStore.current;
  const currentChainName =
    current.chainId == CHAIN_ID_DORADO
      ? "fetch"
      : current.chainName.toLowerCase().replace(" ", "");

  const navigate = useNavigate();

  const env = getEnvironment(current.chainName.toLowerCase());

  const axelarQuery = new AxelarQueryAPI({
    environment: env,
  });
  const api = new AxelarAssetTransfer({
    environment: env,
  });

  const handleAmountChange = (event: any) => {
    const amount = parseFloat(event.target.value);
    setAmount(amount);
    if (isNaN(amount)) {
      setAmountError("Please enter a valid number");
    } else if (amount < 0) {
      setAmountError("Amount cannot be less than zero");
    } else if (amount < transferToken.minDepositAmt) {
      setAmountError("Please enter at least the minimum deposit amount");
    } else if (amount > extractNumberFromBalance(tokenBal)) {
      setAmountError("Insufficient Balance");
    } else {
      setAmountError("");
    }
  };

  useEffect(() => {
    const init = async () => {
      const config: LoadAssetConfig = {
        environment: env,
      };
      setIsChainsLoaded(false);
      try {
        const chains = await loadChains(config);

        const currentChain = chains.find((chain: any) =>
          currentChainName.includes(chain.chainName.toLowerCase())
        );
        console.log("chains", chains);
        console.log("currentChain", currentChain);
        if (currentChain) {
          setTransferChain(currentChain);
          setTransferTokens(currentChain.assets);
          setChains(chains);
          setIsChainsLoaded(true);
          setEstimatedWaitTime(currentChain.estimatedWaitTime);
        } else {
          console.log("Chain not found in Axelar", currentChainName);
        }
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    };
    init();
  }, [currentChainName, env]);
  useEffect(() => {
    const queryToToken = async (transferToken: any, selectedChain: any) => {
      try {
        const toToken: any = await axelarQuery.getAssetConfigFromDenom(
          transferToken.common_key,
          selectedChain.id
        );
        setToToken(toToken || transferToken);
      } catch (error) {
        setToToken(transferToken);
      }
    };
    if (transferToken && recieverChain)
      queryToToken(transferToken, recieverChain);
  }, [transferToken, recieverChain]);

  return (
    <HeaderLayout
      showChainName={false}
      alternativeTitle={"Axelar Bridge"}
      canChangeChainInfo={false}
      onBackButton={() => {
        navigate("/");
      }}
    >
      {isFetchingAddress && (
        <div className={style["loader"]}>
          Generating Deposit address{" "}
          <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      )}
      <div className={style["chain-container"]}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={style["label"]}>Current Chain</div>
          <Input
            style={{ width: "150px", height: "43px", textAlign: "center" }}
            value={current.chainName}
            readOnly={true}
          />
        </div>
        <ChainSelect
          chains={chains}
          recieverChain={recieverChain}
          setRecieverChain={setRecieverChain}
          isChainsLoaded={isChainsLoaded}
          depositAddress={depositAddress}
        />
      </div>

      <RecipientAddress
        recieverChain={recieverChain}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        isDisabled={!recieverChain || depositAddress}
        env={env}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <TokenSelect
          tokens={transferTokens}
          recieverChain={recieverChain}
          depositAddress={depositAddress}
          setTransferToken={setTransferToken}
          transferToken={transferToken}
        />
        <div>
          <div className={style["label"]}>Receive Token</div>
          <Input
            readOnly={true}
            contentEditable={false}
            value={toToken ? toToken.assetSymbol : "Select a Token"}
            style={{ width: "150px", height: "43px", textAlign: "center" }}
          />
        </div>
      </div>
      {transferToken && (
        <TokenBalances
          fromToken={transferToken}
          tokenBal={tokenBal}
          setTokenBal={setTokenBal}
        />
      )}
      <Input
        type="number"
        min="0"
        label={"Enter Amount"}
        onChange={handleAmountChange}
        disabled={!transferToken || depositAddress}
      />

      {amountError ? (
        <div className={style["errorText"]}>{amountError}</div>
      ) : null}

      {transferToken && (
        <GasAndDetails
          transferChain={transferChain}
          recieverChain={recieverChain}
          transferToken={transferToken}
          depositAddress={depositAddress}
          estimatedWaitTime={estimatedWaitTime}
        />
      )}

      {depositAddress ? (
        <SendToken
          transferChain={transferChain}
          recieverChain={recieverChain}
          destinationAddress={recipientAddress}
          depositAddress={depositAddress}
          amount={amount}
          transferToken={transferToken}
        />
      ) : (
        <GetDepositAddress
          fromChain={transferChain}
          toChain={recieverChain}
          recipentAddress={recipientAddress}
          setDepositAddress={setDepositAddress}
          setIsFetchingAddress={setIsFetchingAddress}
          transferToken={transferToken}
          amountError={amountError}
          api={api}
        />
      )}
    </HeaderLayout>
  );
});
