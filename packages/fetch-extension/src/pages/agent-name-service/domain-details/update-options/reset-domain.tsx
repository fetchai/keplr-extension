import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router";
import { resetDomain } from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";
import style from "../confirmation-popup/style.module.scss";
import style1 from "./style.module.scss";
import { AddressInput } from "@new-components/form/address-input";
import { useSendTxConfig } from "@keplr-wallet/hooks";
interface ResetDomainPopupProps {
  handleCancel?: any;
  domain: string;
  setIsTrnsxLoading: any;
  chainStore: any;
  accountStore: any;
}
export const ResetDomain: React.FC<ResetDomainPopupProps> = observer(
  ({ handleCancel, domain, setIsTrnsxLoading, chainStore, accountStore }) => {
    const { queriesStore } = useStore();
    const current = chainStore.current;
    const account = accountStore.getAccount(current.chainId);
    const notification = useNotification();
    const navigate = useNavigate();
    const sendConfigs = useSendTxConfig(
      chainStore,
      queriesStore,
      accountStore,
      current.chainId,
      account.bech32Address,
      {
        allowHexAddressOnEthermint: true,
        computeTerraClassicTax: true,
      }
    );

    const handleResetDomain = async () => {
      try {
        setIsTrnsxLoading(true);
        await resetDomain(
          current.chainId,
          account,
          domain,
          notification,
          sendConfigs.recipientConfig.recipient
        );
        navigate(`/agent-name-service`, {
          state: {
            disclaimer: "Reseting Domain can take upto 5 mins to take effect.",
          },
        });
        setIsTrnsxLoading(false);
      } catch (err) {
        console.error("Error Reseting domain:", err);
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
          Are you sure you want to reset {domain} ?
        </h4>
        <div className={style1["note"]}>
          if new admin is not specified it uses message sender as a new admin.
          <AddressInput
            recipientConfig={sendConfigs.recipientConfig}
            memoConfig={sendConfigs.memoConfig}
            value={""}
            className={style["searchContainer"]}
          />
        </div>
        <div className={style1["buttons-container"]}>
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
            className={style1["options-button"]}
            type="button"
            onClick={handleResetDomain}
          >
            RESET
          </button>
        </div>
      </React.Fragment>
    );
  }
);
