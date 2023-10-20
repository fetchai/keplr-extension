/* eslint-disable import/no-extraneous-dependencies */
import {
  AxelarAssetTransfer,
  EvmChain,
  SendTokenParams,
} from "@axelar-network/axelarjs-sdk";
import { useNotification } from "@components/notification";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { AppCurrency } from "@keplr-wallet/types";
import { getEnvironment } from "@utils/axl-bridge-utils";
import { formatActivityHash } from "@utils/format";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";
import { AXL_BRIDGE_EVM_TRNSX_FEE } from "../../config.ui.var";
import { useStore } from "../../stores";
import style from "./style.module.scss";

interface SendTokenProps {
  transferChain: any;
  recieverChain: any;
  destinationAddress?: string;
  depositAddress: string;
  amount: any;
  transferToken: any;
  recieverToken: any;
}

export const SendToken: React.FC<SendTokenProps> = ({
  transferChain,
  recieverChain,
  // destinationAddress,
  depositAddress,
  amount,
  transferToken,
  recieverToken,
}) => {
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const navigate = useNavigate();
  const notification = useNotification();
  const [isEVMChain, setIsEVMChain] = useState<boolean>(false);
  const [isTrsnxInProgress, setIsTrsnxInProgress] = useState<boolean>(false);

  useEffect(() => {
    const isEVM = Object.values(EvmChain).includes(
      transferChain.chainName.toLowerCase() as EvmChain
    );
    setIsEVMChain(isEVM);
  }, []);

  const api = new AxelarAssetTransfer({
    environment: getEnvironment(current.chainName.toLowerCase()),
  });

  const handleSendToken = async () => {
    console.log("send token", transferToken);
    try {
      if (isEVMChain) {
        //from evm to cosmos
        setIsTrsnxInProgress(true);
        const asset: AppCurrency = {
          coinDecimals: recieverToken.decimals,
          coinDenom: recieverToken.assetSymbol,
          coinMinimalDenom: recieverToken.ibcDenom
            .toLowerCase()
            .includes(current.feeCurrencies[0].coinMinimalDenom.toLowerCase())
            ? recieverToken.ibcDenom
            : `erc20:${recieverToken.tokenAddress}:${recieverToken.assetSymbol}`,
        };

        const fee = AXL_BRIDGE_EVM_TRNSX_FEE;
        const tx = accountStore
          .getAccount(current.chainId)
          .makeSendTokenTx(amount, asset, depositAddress);

        await tx.send(
          fee,
          "",
          {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          },
          {
            onBroadcastFailed(e) {
              console.log(e);
            },
            onFulfill(e) {
              console.log(e);
              notification.push({
                placement: "top-center",
                type: "success",
                duration: 2,
                content: `transaction completed with hash : ${formatActivityHash(
                  e.transactionHash
                )}`,
                canDelete: true,
                transition: {
                  duration: 0.25,
                },
              });
            },
          }
        );
        setIsTrsnxInProgress(false);
        notification.push({
          placement: "top-center",
          type: "primary",
          duration: 2,
          content: `transaction broadcasted!`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
        navigate("/axl-bridge");
      } else {
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
      }
    } catch (err) {
      console.log(err);
      notification.push({
        placement: "top-center",
        type: "warning",
        duration: 2,
        content: `transaction failed!`,
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
