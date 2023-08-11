import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { EthereumBridge } from "./ethereum-bridge";
import { FetchhubBridge } from "./fetchhub-bridge";
import { HeaderLayout } from "@layouts/header-layout";
import { Dec, IntPretty } from "@keplr-wallet/unit";
import style from "./style.module.scss";

export const BridgePage: FunctionComponent = observer(() => {
  const { chainStore, queriesStore } = useStore();
  const navigate = useNavigate();

  const bridgeEvmQuery = queriesStore.get(chainStore.current.chainId).evm
    .queryNativeFetBridge;
  const bridgeFetQuery = queriesStore.get(chainStore.current.chainId).cosmwasm
    .queryNativeFetBridge;

  const isLoading = bridgeEvmQuery.isFetching || bridgeFetQuery.isFetching;
  const isError =
    bridgeEvmQuery.error ||
    bridgeFetQuery.error ||
    !bridgeEvmQuery.status ||
    !bridgeFetQuery.status;
  const isPaused =
    (bridgeEvmQuery.status?.paused ?? true) ||
    (bridgeFetQuery.status?.paused ?? true);
  const isEvmCapReached = bridgeEvmQuery.status
    ? new Dec(bridgeEvmQuery.status.supply).gte(
        new Dec(bridgeEvmQuery.status.cap)
      )
    : true;
  const isFetCapReached = bridgeFetQuery.status
    ? new Dec(bridgeFetQuery.status.supply).gte(
        new Dec(bridgeFetQuery.status.cap)
      )
    : true;

  const isEvm = chainStore.current.features?.includes("evm") ?? false;

  return (
    <HeaderLayout
      showChainName={true}
      canChangeChainInfo={false}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      {isLoading ? (
        <p
          style={{
            textAlign: "center",
            position: "relative",
            top: "45%",
          }}
        >
          Fetching Bridge details <i className="fa fa-spinner fa-spin fa-fw" />{" "}
        </p>
      ) : isError ? (
        <p>Error fetching bridge details, please try later </p>
      ) : isPaused ? (
        <p> Bridge is currently paused. Please try again later </p>
      ) : (!isEvm && isFetCapReached) || (isEvm && isEvmCapReached) ? (
        <p> Bridge cap reached. Please try again later </p>
      ) : isEvm ? (
        <div>
          <div className={style["bridgeLimit"]}>
            ERC20 to Native Limit:{" "}
            {new IntPretty(
              minDec(
                new Dec(bridgeFetQuery.status.supply),
                new Dec(bridgeEvmQuery.status.cap).sub(
                  new Dec(bridgeEvmQuery.status.supply)
                )
              ).quoTruncate(new Dec(1e18))
            )
              .maxDecimals(0)
              .toString()}{" "}
            FET
          </div>
          <EthereumBridge />
        </div>
      ) : (
        <div>
          <div className={style["bridgeLimit"]}>
            Native to ERC20 Limit:{" "}
            {new IntPretty(
              minDec(
                new Dec(bridgeEvmQuery.status.supply),
                new Dec(bridgeFetQuery.status.cap).sub(
                  new Dec(bridgeFetQuery.status.supply)
                )
              ).quoTruncate(new Dec(1e18))
            )
              .maxDecimals(0)
              .toString()}{" "}
            FET
          </div>
          <FetchhubBridge />
        </div>
      )}
    </HeaderLayout>
  );
});

function minDec(...values: Dec[]): Dec {
  const sorted = values.sort((lhs: Dec, rhs: Dec): number => {
    if (lhs.gt(rhs)) {
      return 1;
    } else if (lhs.lt(rhs)) {
      return -1;
    } else {
      return 0;
    }
  });

  return sorted[0];
}
