import React from "react";
import { FunctionComponent } from "react";
import style from "../fns-view/style.module.scss";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import { Button } from "reactstrap";
import { useNavigate } from "react-router";
import { useStore } from "../../stores";
import { EvmChain } from "@axelar-network/axelarjs-sdk";

export const AXLView: FunctionComponent = () => {
  const navigate = useNavigate();
  const { chainStore, analyticsStore } = useStore();
  const isEVM = Object.values(EvmChain).find((evmchain) =>
    chainStore.current.chainName.toLowerCase().includes(evmchain.toLowerCase())
  );
  return (
    <div className={style["containerInner"]}>
      <div className={style["vertical"]}>
        <p
          className={classnames(
            "h2",
            "my-0",
            "font-weight-normal",
            style["paragraphMain"]
          )}
        >
          <FormattedMessage id="main.axl.title" />
        </p>
        <p
          className={classnames(
            "h4",
            "my-0",
            "font-weight-normal",
            style["paragraphSub"]
          )}
        >
          <FormattedMessage id="main.axl.paragraph" />
        </p>
      </div>
      <div style={{ flex: 1 }} />

      <Button
        className={style["button"]}
        color="primary"
        size="sm"
        onClick={() => {
          analyticsStore.logEvent("Axelar Bridge opened", {
            chainId: chainStore.current.chainId,
          });
          isEVM ? navigate("/axl-bridge-evm") : navigate("/axl-bridge-cosmos");
        }}
      >
        <FormattedMessage id="main.axl.button" />
      </Button>
    </div>
  );
};
