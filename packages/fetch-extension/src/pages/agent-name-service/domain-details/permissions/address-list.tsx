import { formatAddressInANS } from "@utils/format";
import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../../stores";
import style from "./style.module.scss";
import { useNavigate } from "react-router";
import { updateDomainPermissions } from "../../../../name-service/ans-api";
import { useNotification } from "@components/notification";
export const AddressList = observer(
  ({
    addresses,
    domain,
    isAdmin,
    isWriter,
  }: {
    addresses: any[];
    domain: string;
    isAdmin: boolean;
    isWriter?: boolean;
  }) => {
    const { chainStore, accountStore } = useStore();
    const current = chainStore.current;
    const account = accountStore.getAccount(current.chainId);
    const navigate = useNavigate();
    const notification = useNotification();
    const handleRemove = async (address: string) => {
      try {
        await updateDomainPermissions(
          account,
          address,
          domain,
          "deny",
          notification
        );
        navigate("/agent-name-service");
      } catch (err) {
        console.error("Error minting domain:", err);
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
        navigate("/agent-name-service");
      }
    };

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
                  onClick={() => handleRemove(address)}
                  className={style["cancel"]}
                  style={{ width: "12px", height: "18px" }}
                >
                  X
                </div>
              )}
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }
);
