/* eslint-disable import/no-extraneous-dependencies */
import {
  AxelarAssetTransfer,
  SendTokenParams,
} from "@axelar-network/axelarjs-sdk";
import { useNotification } from "@components/notification";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { getEnvironment } from "@utils/axl-bridge-utils";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";
import style from "../style.module.scss";

interface SendTokenProps {
  transferChain: any;
  recieverChain: any;
  destinationAddress?: string;
  depositAddress: string;
  amount: any;
  transferToken: any;
}

export const SendToken: React.FC<SendTokenProps> = ({
  transferChain,
  recieverChain,
  // destinationAddress,
  depositAddress,
  amount,
  transferToken,
}) => {
  const { chainStore } = useStore();
  const current = chainStore.current;
  const navigate = useNavigate();
  const notification = useNotification();
  const [isTrsnxInProgress, setIsTrsnxInProgress] = useState<boolean>(false);

  const api = new AxelarAssetTransfer({
    environment: getEnvironment(current.chainName.toLowerCase()),
  });

  const handleSendToken = async () => {
    try {
      // from cosmos to evm
      const signer: OfflineDirectSigner = window.keplr?.getOfflineSigner(
        current.chainId
      ) as OfflineDirectSigner;
      const value = (amount * 10 ** transferToken.decimals).toString();
      setIsTrsnxInProgress(true);
      const requestOptions: SendTokenParams = {
        fromChain: transferChain.id,
        toChain: recieverChain.id,
        destinationAddress: depositAddress,
        asset: {
          denom: transferToken.ibcDenom,
        },
        amountInAtomicUnits: value,
        options: {
          cosmosOptions: {
            cosmosDirectSigner: signer,
            rpcUrl: current.rpc,
            fee: {
              gas: "250000",
              amount: [{ denom: transferToken.ibcDenom, amount: "30000" }],
            },
          },
        },
      };
      const send = await api.sendToken(requestOptions);
      console.log(send);
      setIsTrsnxInProgress(false);
      navigate("/axl-bridge");
      notification.push({
        placement: "top-center",
        type: "success",
        duration: 2,
        content: `transaction completed!`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
    } catch (err) {
      console.log(err);
      notification.push({
        placement: "top-center",
        type: "warning",
        duration: 2,
        content: `transaction failed: ${err.message}`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      console.log(err);
      navigate("/axl-bridge");
    }
  };

  return (
    <React.Fragment>
      {isTrsnxInProgress && (
        <div className={style["loader"]}>
          Transaction In Progress <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      )}
      <Button
        type="submit"
        color="primary"
        style={{ width: "100%" }}
        onClick={handleSendToken}
      >
        Send Token
      </Button>
    </React.Fragment>
  );
};
