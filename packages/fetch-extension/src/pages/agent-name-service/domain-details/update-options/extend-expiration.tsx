import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { extendDomainExpiration } from "../../../../name-service/ans-api";
import style from "./style.module.scss";
import { ExpirationField } from "@components/expiration-field";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  SecretAccount,
  EthereumAccount,
} from "@keplr-wallet/stores";
interface ExtendDomainExpirationProps {
  handleCancel: any;
  domain: string;
  account: AccountSetBase &
    CosmosAccount &
    CosmwasmAccount &
    SecretAccount &
    EthereumAccount;
  setIsTrnsxLoading: any;
  chainId: any;
}

export const ExtendDomainExpiration: React.FC<ExtendDomainExpirationProps> =
  observer(({ handleCancel, domain, setIsTrnsxLoading, account, chainId }) => {
    const notification = useNotification();
    const navigate = useNavigate();
    const [expiryDateTime, setExpiryDateTime] = useState();

    const handleTransaction = async (
      action: any,
      notificationConfig: any,
      redirectPath?: any
    ) => {
      try {
        const a = await action();
        console.log("hash:", a);
        navigate(`/agent-name-service/${redirectPath}`, {
          state: {
            disclaimer: "Changes can take up to 5 mins to take effect.",
          },
        });
      } catch (err) {
        setIsTrnsxLoading(false);
        console.error("Error updating permissions:", err);
        notification.push({
          placement: "top-center",
          type: "warning",
          duration: 2,
          content: `Transaction failed!`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
          ...notificationConfig,
        });
        navigate(`/agent-name-service/`);
      }
    };

    const handleExtendExpiration = async () => {
      const notificationConfig = {
        content: "Changes can take up to 5 mins to take effect.",
      };
      await handleTransaction(
        extendDomainExpiration(chainId, account, domain, notification),
        notificationConfig,
        ""
      );
    };

    return (
      <React.Fragment>
        <h4 style={{ color: "white" }}>
          Are you sure you want to extend expiration of {domain} ?
        </h4>

        <div className={style["note"]}>
          Domain expiry can only be extended earlier than 3hrs before
          expiration!
          <ExpirationField
            setExpiryDateTime={setExpiryDateTime}
            styleProps={{ width: "273px", margin: "0px" }}
          />
        </div>

        <div className={style["buttons-container"]}>
          {handleCancel && (
            <button
              style={{ marginTop: "10px" }}
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
          <button
            disabled={!expiryDateTime}
            className={style["options-button"]}
            type="button"
            onClick={handleExtendExpiration}
          >
            EXTEND
          </button>
        </div>
      </React.Fragment>
    );
  });
