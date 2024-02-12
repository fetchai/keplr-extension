import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  removeDomain,
  resetDomain,
  updateRecord,
} from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";
import style from "../confirmation-popup/style.module.scss";
import style1 from "./style.module.scss";
import { AddressInput } from "@new-components/form/address-input";
import { useSendTxConfig } from "@keplr-wallet/hooks";
import { Input } from "reactstrap";
import { ExpirationField } from "@components/expiration-field";

export const OptionConfirmationPopup = observer(
  ({
    handleCancel,
    domain,
    setIsTrnsxLoading,
    selectedOption,
  }: {
    handleCancel?: any;
    domain: string;
    address?: string;
    setIsTrnsxLoading: any;
    selectedOption: any;
  }) => {
    const { chainStore, accountStore, queriesStore } = useStore();
    const notification = useNotification();
    const current = chainStore.current;
    const navigate = useNavigate();
    const [agentAddress, setAgentAddress] = useState();
    const [expiryDateTime, setExpiryDateTime] = useState();
    const account = accountStore.getAccount(current.chainId);
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

    const handleTransaction = async (
      action: any,
      notificationConfig: any,
      redirectPath: any
    ) => {
      try {
        await action();
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
    const handleRemoveDomain = async () => {
      const notificationConfig = {
        content: "Removal of domain can take up to 5 mins to take effect.",
      };
      await handleTransaction(
        () => removeDomain(current.chainId, account, domain, notification),
        notificationConfig,
        ""
      );
    };
    const handleResetDomain = async () => {
      const notificationConfig = {
        content: "Changes can take up to 5 mins to take effect.",
      };
      await handleTransaction(
        () =>
          resetDomain(
            current.chainId,
            account,
            domain,
            notification,
            sendConfigs.recipientConfig.recipient
              ? sendConfigs.recipientConfig.recipient
              : undefined
          ),
        notificationConfig,
        ""
      );
    };
    const handleExtendExpiration = async () => {
      const notificationConfig = {
        content: "Changes can take up to 5 mins to take effect.",
      };
      await handleTransaction(() => {}, notificationConfig, "");
    };
    const handleUpdateRecord = async () => {
      const notificationConfig = {
        content: "Changes can take up to 5 mins to take effect.",
      };
      await handleTransaction(
        () =>
          updateRecord(
            current.chainId,
            account,
            domain,
            notification,
            agentAddress
          ),
        notificationConfig,
        `domain-details/${domain}/owner`
      );
    };
    const handleSelectedOption = () => {
      switch (selectedOption) {
        case "Reset":
          handleResetDomain();
          break;
        case "Extend":
          handleExtendExpiration();
          break;
        case "Remove":
          handleRemoveDomain();
          break;
        case "Update":
          handleUpdateRecord();
          break;
        default:
          // Handle default case if needed
          break;
      }
    };

    return (
      <React.Fragment>
        <div className={style["popupCard"]}>
          <h4 style={{ color: "white" }}>
            Are you sure you want to {selectedOption}{" "}
            {selectedOption === "Update" && "agent record for "} {domain} ?
          </h4>

          {selectedOption === "Reset" && (
            <React.Fragment>
              <AddressInput
                recipientConfig={sendConfigs.recipientConfig}
                memoConfig={sendConfigs.memoConfig}
                label={
                  "if new admin is not specified it uses message sender as a new admin."
                }
                value={""}
                className={style["searchContainer"]}
              />
            </React.Fragment>
          )}
          {selectedOption === "Update" && (
            <React.Fragment>
              <Input
                className={style1["searchInput"]}
                type="text"
                value={agentAddress}
                onChange={(e: any) => {
                  setAgentAddress(e.target.value);
                }}
                placeholder="Enter agent address"
              />
            </React.Fragment>
          )}
          {selectedOption === "Extend" && (
            <React.Fragment>
              <ExpirationField setExpiryDateTime={setExpiryDateTime} />
            </React.Fragment>
          )}
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
              disabled={
                (selectedOption == "Update" && !agentAddress) ||
                (selectedOption == "Extend" && !expiryDateTime)
              }
              className={style1["options-button"]}
              type="button"
              onClick={handleSelectedOption}
            >
              {selectedOption}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
