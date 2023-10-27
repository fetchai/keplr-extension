/* eslint-disable import/no-extraneous-dependencies */
import {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  LoadAssetConfig,
  loadChains,
} from "@axelar-network/axelarjs-sdk";
import { Input } from "@components/form";
import {
  BridgeAmountError,
  EmptyAmountError,
  InsufficientAmountError,
  InvalidNumberAmountError,
  NegativeAmountError,
  ZeroAmountError,
  useSendTxConfig,
} from "@keplr-wallet/hooks";
import { HeaderLayout } from "@layouts/header-layout";
import {
  extractNumberFromBalance,
  getEnvironment,
} from "@utils/axl-bridge-utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useStore } from "../../../stores";
import { GetDepositAddress } from "./get-deposit-address";
import { RecipientAddress } from "../recipient-address";
import { SendToken } from "./send-token";
import style from "../style.module.scss";
import { GasAndDetails } from "./gas-and-details";

export const AxelarBridgeEVM = observer(() => {
  const { chainStore, queriesStore, accountStore } = useStore();

  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const configs = useSendTxConfig(
    chainStore,
    queriesStore,
    accountStore,
    current.chainId,
    accountInfo.bech32Address,
    {
      allowHexAddressOnEthermint: true,
      computeTerraClassicTax: true,
    }
  );
  const intl = useIntl();
  const error = configs.amountConfig.error;
  const errorText: string | undefined = useMemo(() => {
    if (error) {
      switch (error.constructor) {
        case EmptyAmountError:
          // No need to show the error to user.
          return;
        case InvalidNumberAmountError:
          return intl.formatMessage({
            id: "input.amount.error.invalid-number",
          });
        case ZeroAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-zero",
          });
        case NegativeAmountError:
          return intl.formatMessage({
            id: "input.amount.error.is-negative",
          });
        case InsufficientAmountError:
          return intl.formatMessage({
            id: "input.amount.error.insufficient",
          });
        case BridgeAmountError:
          return error.message;
        default:
          return intl.formatMessage({ id: "input.amount.error.unknown" });
      }
    }
  }, [intl, error]);

  configs.memoConfig.setMemo("");
  configs.feeConfig.setFeeType("high");

  // to chain list
  const [transferChain, setTransferChain] = useState<any>();
  const [chains, setChains] = useState<any[]>([]);
  const [recieverChain, setRecieverChain] = useState<any>();

  const [transferTokens, setTransferTokens] = useState<any[]>([]);
  const [transferToken, setTransferToken] = useState<any>();
  const [recipientAddress, setRecipientAddress] = useState("");

  // UI related state
  const [isChainsLoaded, setIsChainsLoaded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);
  const [isInactiveChain, setIsInactiveChain] = useState<boolean>(false);

  const currentChainName = current.chainName.toLowerCase().replace(" ", "");

  const navigate = useNavigate();

  const env = getEnvironment(current.chainName.toLowerCase());

  const assetsApi = new AxelarAssetTransfer({
    environment: env,
  });

  const queryApi = new AxelarQueryAPI({
    environment: env,
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChainSelect = async (chain: string) => {
    setRecieverChain(chain);
    toggleDropdown();
  };

  const query = queriesStore
    .get(current.chainId)
    .queryBalances.getQueryBech32Address(accountInfo.bech32Address);

  const [toToken, setToToken] = useState<any>();
  const [amountError, setAmountError] = useState<any>();
  const [tokenBal, setTokenBal] = useState<any>("");
  const [tokenDropdown, setTokenDropdown] = useState(false);

  useEffect(() => {
    if (transferToken) {
      const { balances, nonNativeBalances } = query;
      const queryBalances = balances.concat(nonNativeBalances);
      const queryBalance = queryBalances.find(
        (bal) =>
          transferToken.assetSymbol == bal.currency.coinDenom ||
          transferToken.ibcDenom == bal.currency.coinMinimalDenom
      );
      if (queryBalance?.balance)
        setTokenBal(queryBalance.balance.trim(true).maxDecimals(6).toString());
    } else {
      setTokenBal(null);
    }
  }, [transferToken]);
  useEffect(() => {
    if (transferToken && recieverChain) {
      const toToken: any = recieverChain?.assets.find(
        (asset: any) => asset.common_key === transferToken.common_key
      );
      setToToken(toToken);
    }
  }, [transferToken, recieverChain]);

  const handleTokenSelect = (token: any) => {
    const tokenCurrency = current.currencies.find(
      (currency: any) =>
        currency.contractAddress == token.tokenAddress ||
        currency.coinMinimalDenom === token.ibcDenom
    );
    configs.amountConfig.setSendCurrency(tokenCurrency);
    setTransferToken(token);
    setTokenDropdown(false);
  };
  const handleAmountChange = (event: any) => {
    configs.amountConfig.setAmount(event.target.value);
    const value = parseFloat(event.target.value);
    if (value < transferToken.minDepositAmt) {
      setAmountError("Please enter at least the minimum deposit amount");
    } else if (value > extractNumberFromBalance(tokenBal)) {
      setAmountError("Insufficient asset");
    } else {
      setAmountError(null);
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
        const activeChains = await queryApi.getActiveChains();
        const currentChain = chains.find(
          (chain: any) =>
            currentChainName.includes(chain.chainName.toLowerCase()) &&
            activeChains.find(
              (activeChain) =>
                activeChain.toLowerCase() == chain.id.toLowerCase()
            )
        );
        console.log("activeChains", activeChains);
        console.log("chains", chains);
        console.log("currentChain", currentChain);
        if (currentChain) {
          setTransferChain(currentChain);
          setTransferTokens(currentChain.assets);
          setChains(chains);
        } else {
          setIsInactiveChain(true);
        }
        setIsChainsLoaded(true);
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    };
    init();
  }, [currentChainName, env]);
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
      {isInactiveChain && (
        <div className={style["loader"]}>
          Axelar Bridge not active for {current.chainName}
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
            disabled={
              !isChainsLoaded || configs.recipientConfig.rawRecipient.length > 0
            }
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
        isDisabled={
          configs.recipientConfig.rawRecipient.length > 0 || !recieverChain
        }
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
            isOpen={tokenDropdown}
            toggle={() => setTokenDropdown(!tokenDropdown)}
            disabled={
              !recieverChain || configs.recipientConfig.rawRecipient.length > 0
            }
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
            disabled={configs.recipientConfig.rawRecipient.length > 0}
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
          <div>Balance : {tokenBal ? tokenBal : "0.0"}</div>
        </div>
      )}
      <Input
        type="number"
        min="0"
        placeholder="Enter Amount"
        onChange={handleAmountChange}
        disabled={
          !transferToken || configs.recipientConfig.rawRecipient.length > 0
        }
      />

      {amountError ? (
        <div className={style["errorText"]}>{errorText || amountError}</div>
      ) : null}
      {transferToken && (
        <GasAndDetails
          transferChain={transferChain}
          recieverChain={recieverChain}
          transferToken={transferToken}
          depositAddress={configs.recipientConfig.rawRecipient}
          estimatedWaitTime={transferChain.estimatedWaitTime}
        />
      )}

      {configs.recipientConfig.rawRecipient ? (
        <SendToken sendConfigs={configs} />
      ) : (
        <GetDepositAddress
          recipientConfig={configs.recipientConfig}
          fromChain={transferChain}
          toChain={recieverChain}
          recipentAddress={recipientAddress}
          setIsFetchingAddress={setIsFetchingAddress}
          transferToken={transferToken}
          isDisabled={
            !!errorText ||
            !recipientAddress ||
            configs.amountConfig.sendCurrency === undefined
          }
          api={assetsApi}
        />
      )}
    </HeaderLayout>
  );
});
