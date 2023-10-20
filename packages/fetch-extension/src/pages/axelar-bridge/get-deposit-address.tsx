/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { EvmChain } from "@axelar-network/axelarjs-sdk";
import { useStore } from "../../stores";
import { useNotification } from "@components/notification";

interface GetDepositAddressProps {
  setIsDepositAddressFetched: any;
  setDepositAddress: any;
  fromChain: any;
  toChain: any;
  recipentAddress: string;
  setIsFetchingAddress: any;
  transferToken: any;
  amountError: string;
  api: any;
}

export const GetDepositAddress: React.FC<GetDepositAddressProps> = ({
  setIsDepositAddressFetched,
  setDepositAddress,
  fromChain,
  toChain,
  recipentAddress,
  setIsFetchingAddress,
  transferToken,
  api,
  amountError,
}) => {
  const { accountStore, chainStore } = useStore();
  const current = chainStore.current;
  const [refundAddress, setRefundAddress] = useState<any>();
  const notification = useNotification();
  useEffect(() => {
    const init = async () => {
      const isEVM = Object.values(EvmChain).includes(
        current.chainName.toLowerCase() as EvmChain
      );
      if (isEVM) {
        const address = accountStore.getAccount(
          current.chainId
        ).ethereumHexAddress;
        setRefundAddress(address);
      } else {
        setRefundAddress(
          accountStore.getAccount(current.chainId).bech32Address
        );
      }
    };
    init();
  }, []);

  const getDepositAddress = async () => {
    try {
      setIsFetchingAddress(true);
      const address = await api.getDepositAddress({
        fromChain: fromChain.id,
        toChain: toChain.id,
        destinationAddress: recipentAddress,
        asset: transferToken.common_key,
        options: { refundAddress },
      });
      setDepositAddress(address);
      setIsDepositAddressFetched(true);
      setIsFetchingAddress(false);
    } catch (err) {
      console.log("Error", err);
      notification.push({
        placement: "top-center",
        type: "danger",
        duration: 5,
        content: "Error in fetching deposit address, Chain id not supported",
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
      disabled={
        !(transferToken && fromChain && toChain && recipentAddress) ||
        amountError !== ""
      }
    >
      Get Deposit Address
    </Button>
  );
};
