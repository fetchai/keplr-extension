import { formatAddressInANS } from "@utils/format";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../../stores";
import { ConfirmationPopup } from "../confirmation-popup";
import style from "./style.module.scss";

export const AddressList = observer(
  ({
    addresses,
    domain,
    isAdmin,
    isWriter,
    setIsTrnsxLoading,
  }: {
    addresses: any[];
    domain: string;
    isAdmin: boolean;
    isWriter?: boolean;
    setIsTrnsxLoading: any;
  }) => {
    const { chainStore, accountStore } = useStore();
    const current = chainStore.current;
    const account = accountStore.getAccount(current.chainId);

    const [denyAddress, setDenyAddress] = React.useState<string>();

    return (
      <React.Fragment>
        {addresses.map((address: string, index: number) => (
          <div className={style["domainCard"]} key={index}>
            <div className={style["domainDetails"]}>
              <div className={style["agentDomainData"]}>
                {address === account.bech32Address && (
                  <div className={style["currentWallet"]}>CURRENT WALLET</div>
                )}
                {formatAddressInANS(address)}
              </div>
              {isAdmin && (addresses.length > 1 || isWriter) && (
                <div
                  onClick={() => setDenyAddress(address)}
                  className={style["cancel"]}
                  style={{ width: "12px", height: "18px" }}
                >
                  X
                </div>
              )}
            </div>

            <ConfirmationPopup
              address={denyAddress}
              handleCancel={() => setDenyAddress(undefined)}
              permission={isWriter ? "writer" : "owner"}
              domain={domain}
              setIsTrnsxLoading={setIsTrnsxLoading}
            />
          </div>
        ))}
      </React.Fragment>
    );
  }
);
