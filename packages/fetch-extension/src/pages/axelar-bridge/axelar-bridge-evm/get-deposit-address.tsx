/* eslint-disable import/no-extraneous-dependencies */
import { useNotification } from "@components/notification";
import {
  IRecipientConfig,
  IRecipientConfigWithICNS,
} from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button } from "reactstrap";
import { useStore } from "../../../stores";

interface GetDepositAddressProps {
  recipientConfig: IRecipientConfig | IRecipientConfigWithICNS;
  fromChain: any;
  toChain: any;
  recipentAddress: string;
  setIsFetchingAddress: any;
  transferToken: any;
  api: any;
  isDisabled: boolean;
}

export const GetDepositAddress: React.FC<GetDepositAddressProps> = observer(
  ({
    api,
    fromChain,
    toChain,
    recipientConfig,
    recipentAddress,
    setIsFetchingAddress,
    transferToken,
    isDisabled,
  }) => {
    const { accountStore, chainStore } = useStore();
    const current = chainStore.current;
    const accountInfo = accountStore.getAccount(current.chainId);
    const notification = useNotification();

    const getDepositAddress = async () => {
      try {
        setIsFetchingAddress(true);
        const address = await api.getDepositAddress({
          fromChain: fromChain.id,
          toChain: toChain.id,
          destinationAddress: recipentAddress,
          asset: transferToken.common_key,
          options: { refundAddress: accountInfo.ethereumHexAddress },
        });
        console.log("Deposit Address", address);
        recipientConfig.setRawRecipient(address);
        setIsFetchingAddress(false);
      } catch (err) {
        console.log("Error", err);
        notification.push({
          placement: "top-center",
          type: "danger",
          duration: 5,
          content: `Error fetching deposit address: ${err.message} `,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
        setIsFetchingAddress(false);
      }
    };
    return (
      <Button
        type="submit"
        color="primary"
        style={{ width: "100%" }}
        onClick={getDepositAddress}
        disabled={isDisabled}
      >
        Get Deposit Address
      </Button>
    );
  }
);
