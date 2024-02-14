import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router";
import { removeDomain } from "../../../../name-service/ans-api";
import style from "./style.module.scss";
import {
  AccountSetBase,
  CosmosAccount,
  CosmwasmAccount,
  SecretAccount,
  EthereumAccount,
} from "@keplr-wallet/stores";
interface RemoveDomainProps {
  handleCancel?: any;
  domain: string;
  setIsTrnsxLoading: any;
  chainId: string;
  account: AccountSetBase &
    CosmosAccount &
    CosmwasmAccount &
    SecretAccount &
    EthereumAccount;
}

export const RemoveDomain: React.FC<RemoveDomainProps> = observer(
  ({ handleCancel, domain, setIsTrnsxLoading, chainId, account }) => {
    const notification = useNotification();
    const navigate = useNavigate();

    const handleRemoveDomain = async () => {
      try {
        setIsTrnsxLoading(true);
        await removeDomain(chainId, account, domain, notification);
        navigate(`/agent-name-service`, {
          state: {
            disclaimer:
              "Removal of Domain can take upto 5 mins to take effect.",
          },
        });
        setIsTrnsxLoading(false);
      } catch (err) {
        console.error("Error Removing domain:", err);
        setIsTrnsxLoading(false);
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
        navigate("/agent-name-service/");
      }
    };

    return (
      <React.Fragment>
        <h4 style={{ color: "white" }}>
          Are you sure you want to remove {domain} ?
        </h4>
        <div className={style["note"]}>
          Your Domain will be permanently removed!
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
            className={style["options-button"]}
            type="button"
            onClick={handleRemoveDomain}
          >
            REMOVE
          </button>
        </div>
      </React.Fragment>
    );
  }
);
