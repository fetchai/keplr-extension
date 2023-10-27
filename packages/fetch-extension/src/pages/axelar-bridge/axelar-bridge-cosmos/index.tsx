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
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useStore } from "../../../stores";
import { GasAndDetails } from "./gas-and-details";
import { GetDepositAddress } from "./get-deposit-address";
import { RecipientAddress } from "../recipient-address";
import { SendToken } from "./send-token";
import style from "../style.module.scss";
import { TokenBalances } from "../token-balances";
import { CHAIN_ID_DORADO } from "../../../config.ui.var";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fromTokenDropdownOpen, setFromTokenDropdownOpen] = useState(false);
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleFromTokenDropdown = () => {
    setFromTokenDropdownOpen(!fromTokenDropdownOpen);
  };
  const handleChainSelect = async (chain: string) => {
    setRecieverChain(chain);
    toggleDropdown();
  };
  const handleTokenSelect = (token: any) => {
    setTransferToken(token);
    toggleFromTokenDropdown();
  };
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
      setAmountError("Insufficient asset");
    } else if (!extractNumberFromBalance(tokenBal)) {
      setAmountError("You do not have enough Balance");
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className={style["label"]}>To Chain</div>
          <ButtonDropdown
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
            disabled={!isChainsLoaded || depositAddress}
          >
            <DropdownToggle style={{ width: "150px" }} caret>
              {!isChainsLoaded ? (
                <React.Fragment>
                  loading <i className="fas fa-spinner fa-spin ml-2" />
                </React.Fragment>
              ) : recieverChain ? (
                recieverChain.id
              ) : (
                "Select network"
              )}
            </DropdownToggle>
            <DropdownMenu style={{ maxHeight: "200px", overflow: "auto" }}>
              {chains.map((chain: any) => (
                <DropdownItem
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                >
                  {chain.id}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
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
        <div>
          <div className={style["label"]}>Transfer Token</div>
          <ButtonDropdown
            isOpen={fromTokenDropdownOpen}
            toggle={() => setFromTokenDropdownOpen(!fromTokenDropdownOpen)}
            disabled={!recieverChain || depositAddress}
            style={{ width: "150px" }}
          >
            <DropdownToggle style={{ width: "150px" }} caret>
              {transferToken ? transferToken.assetSymbol : "Select a Token"}
            </DropdownToggle>
            <DropdownMenu style={{ maxHeight: "200px", overflow: "auto" }}>
              {transferTokens &&
                transferTokens
                  .filter((token) =>
                    recieverChain?.assets.find(
                      (asset: any) => asset.common_key === token.common_key
                    )
                  )
                  .map((token) => (
                    <DropdownItem
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      key={token.common_key}
                      onClick={() => handleTokenSelect(token)}
                    >
                      {token.assetSymbol}
                    </DropdownItem>
                  ))}
            </DropdownMenu>
          </ButtonDropdown>
        </div>
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
        <div
          style={{ float: "right", fontSize: "small" }}
          className={style["label"]}
        >
          Min Amount :
          {`${transferToken.minDepositAmt} ${transferToken.assetSymbol}`}
          <TokenBalances
            fromToken={transferToken}
            tokenBal={tokenBal}
            setTokenBal={setTokenBal}
          />
        </div>
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
