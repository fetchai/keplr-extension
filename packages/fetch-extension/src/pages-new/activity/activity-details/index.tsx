import { HeaderLayout } from "@layouts-v2/header-layout";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import style from "./style.module.scss";
import moment from "moment";
import { Card } from "@components-v2/card";
import { useStore } from "../../../stores";
import { formatActivityHash, formatAddress } from "@utils/format";
import { ButtonV2 } from "@components-v2/buttons/button";
import { useLanguage } from "../../../languages";
import { CoinPretty, Int } from "@keplr-wallet/unit";
import { AppCurrency } from "@keplr-wallet/types";

export const ActivityDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = useLanguage();
  const details = location.state.details || {};
  const fees = JSON.parse(details.fees);
  const [usdValue, setUsdValue] = useState<any>("$0");
  console.log(details);
  const { priceStore } = useStore();
  const fiatCurrency = language.fiatCurrency;
  const convertToUsd = (currency: any) => {
    const value = priceStore.calculatePrice(currency, fiatCurrency);
    const inUsd = value && value.shrink(true).maxDecimals(6).toString();
    return inUsd;
  };
  const currency: AppCurrency = {
    coinDenom: "FET",
    coinMinimalDenom: "afet",
    coinDecimals: 18,
    coinGeckoId: "fetch-ai",
  };
  useEffect(() => {
    if (details.amt) {
      const amountInNumber = parseFloat(details.amt[0].amount);
      const inputValue = new CoinPretty(currency, new Int(amountInNumber));
      const inputValueInUsd = convertToUsd(inputValue);
      setUsdValue(inputValueInUsd);
    }
  }, []);

  const handleClick = () => {
    const mintscanURL = `https://www.mintscan.io/fetchai/tx/${details.hash}/`;
    window.open(mintscanURL, "_blank");
  };
  const verbs = ["Redelegated", "Staked", "Unstaked", "Claimed"];
  return (
    <HeaderLayout
      onBackButton={() => navigate(-1)}
      showTopMenu={true}
      alternativeTitle=""
    >
      <div className={style["topBar"]}>
        <img src={require("@assets/svg/wireframe/fetch-logo.svg")} alt="verb" />
        <div className={style["verb"]}>{details.verb}</div>
        <div className={style["time"]}>
          {" "}
          {moment(details.timestamp).utc().format("ddd, DD MMM YYYY hh:mm A")}
        </div>
      </div>

      <div className={style["card"]}>
        <Card
          leftImage={
            verbs.includes(details.verb)
              ? require("@assets/svg/wireframe/stake-v2.svg")
              : require("@assets/svg/wireframe/wallet.svg")
          }
          style={{ background: "transparent" }}
          heading={details.signerAddress ? "From" : "deligator address"}
          subheading={formatAddress(
            details.signerAddress
              ? details.signerAddress
              : details.deligatorAddress
          )}
        />
        <Card
          leftImage={
            verbs.includes(details.verb)
              ? require("@assets/svg/wireframe/stake-v2.svg")
              : require("@assets/svg/wireframe/wallet.svg")
          }
          style={{ background: "transparent", width: "337px" }}
          heading={details.toAddress ? "to" : "Validator address"}
          subheading={formatAddress(
            details.toAddress ? details.toAddress : details.validatorAddress
          )}
          rightContent={
            <div className={style["cardAmt"]}>
              {" "}
              <div className={style["inFET"]}>
                {" "}
                {`${details.amountNumber} ${details.amountAlphabetic}`}
              </div>{" "}
              {usdValue && <div className={style["inUSD"]}>{usdValue}</div>}
            </div>
          }
        />
      </div>
      <div className={style["container"]}>
        <div>Transaction Hash</div>
        <div className={style["version"]}>
          {formatActivityHash(details.hash)}
        </div>
      </div>
      <div className={style["hr"]} />
      <div className={style["container"]}>
        <div>Chain ID</div>
        <div className={style["version"]}>fetchhub-4</div>
      </div>
      <div className={style["hr"]} />
      {details.verb !== "Received" && (
        <React.Fragment>
          <div className={style["container"]}>
            <div>Gas used/wanted</div>
            <div className={style["version"]}>
              {details.gasUsed ? details.gasUsed : "-"}
            </div>
          </div>
          <div className={style["hr"]} />
          <div className={style["container"]}>
            <div>Fees</div>
            <div className={style["version"]}>
              {`${fees[0].amount} ${fees[0].denom}`}
            </div>
          </div>
          <div className={style["hr"]} />
          <div className={style["container"]}>
            <div>Memo</div>
            <div className={style["version"]}>
              {details.memo == "" ? "-" : details.memo}
            </div>
          </div>
          <div className={style["hr"]} />
        </React.Fragment>
      )}
      <div className={style["container"]}>
        <div>Total amount</div>
        <div className={style["version"]}>
          {`${details.amountNumber} ${details.amountAlphabetic}`}
        </div>
      </div>
      <div className={style["hr"]} />
      <div className={style["buttons"]}>
        {details.verb !== "Received" ? (
          <div className={style["buttons"]} style={{ width: "100%" }}>
            <ButtonV2
              styleProps={{
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
              }}
              text=""
            >
              {details.verb == "staked" ? (
                <React.Fragment>
                  <img
                    src={require("@assets/svg/wireframe/stake.svg")}
                    alt=""
                  />
                  Stake again
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <img
                    src={require("@assets/svg/wireframe/arrow-up-1.svg")}
                    alt=""
                  />
                  Send again
                </React.Fragment>
              )}
            </ButtonV2>{" "}
            <ButtonV2
              styleProps={{
                background: "transparent",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.6",
              }}
              text=""
              onClick={handleClick}
            >
              View on Mintscan
            </ButtonV2>
          </div>
        ) : (
          <ButtonV2
            styleProps={{
              background: "transparent",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.6",
            }}
            onClick={handleClick}
            text=""
          >
            View on Mintscan
          </ButtonV2>
        )}
      </div>
    </HeaderLayout>
  );
};
