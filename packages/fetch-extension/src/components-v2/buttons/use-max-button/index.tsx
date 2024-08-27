import React from "react";
import { ButtonV2 } from "../button";
import { IAmountConfig } from "@keplr-wallet/hooks";
import { useStore } from "../../../stores";

export const UseMaxButton = ({
  amountConfig,
  isToggleClicked,
  setIsToggleClicked,
}: {
  amountConfig: IAmountConfig;
  isToggleClicked: boolean;
  setIsToggleClicked: any;
}) => {
  const { priceStore } = useStore();

  const ChangeButtonElement = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          style={{
            width: "18px",
            height: "14px",
            opacity: 0.6,
          }}
          src={require("@assets/svg/wireframe/chevron.svg")}
          alt=""
        />
        <div>{`Change to ${
          !isToggleClicked
            ? priceStore.defaultVsCurrency.toUpperCase()
            : amountConfig.sendCurrency.coinDenom
        }`}</div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >
      <ButtonV2
        styleProps={{
          width: "100%",
          padding: "2px 15px",
          height: "44px",
          marginTop: "0",
          background: "transparent",
          color: "white",
          border: "1px solid rgba(255,255,255,0.4)",
          fontSize: "14px",
        }}
        disabled={!amountConfig.sendCurrency["coinGeckoId"]}
        text={<ChangeButtonElement />}
        onClick={() => {
          setIsToggleClicked(!isToggleClicked);
        }}
      />

      <ButtonV2
        text="Use max available"
        styleProps={{
          width: "100%",
          padding: "2px 15px",
          height: "44px",
          marginTop: "0",
          background: "transparent",
          color: "white",
          border: "1px solid rgba(255,255,255,0.4)",
          fontSize: "14px",
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          amountConfig.toggleIsMax();
        }}
      />
    </div>
  );
};
