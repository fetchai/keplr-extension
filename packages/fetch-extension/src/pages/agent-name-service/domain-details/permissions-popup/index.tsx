import React, { useMemo } from "react";
import style from "./style.module.scss";
import { updateDomainPermissions } from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";
import { useNotification } from "@components/notification";
import { useNavigate } from "react-router";
import { useSendTxConfig } from "@keplr-wallet/hooks";
import { AddressInput } from "@new-components/form/address-input";
import { observer } from "mobx-react-lite";

export const PermissionsPopup = observer(
  ({
    handleCancel,
    permission,
    domain,
    setIsTrnsxLoading,
    setIsPopupOpen,
  }: {
    handleCancel?: any;
    permission: string;
    domain: string;
    setIsTrnsxLoading: any;
    setIsPopupOpen: any;
  }) => {
    const { chainStore, accountStore, queriesStore } = useStore();
    const notification = useNotification();
    const current = chainStore.current;
    const navigate = useNavigate();
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

    const error = sendConfigs.recipientConfig.error;
    const errorText: boolean | undefined = useMemo(() => {
      if (error) {
        if (error.constructor) {
          return true;
        }
      }
      return false;
    }, [error]);

    const handlePermission = async () => {
      try {
        setIsTrnsxLoading(true);
        setIsPopupOpen(false);
        await updateDomainPermissions(
          current.chainId,
          account,
          sendConfigs.recipientConfig.recipient,
          domain,
          permission == "owner" ? "admin" : permission,
          notification
        );
        setIsTrnsxLoading(false);
        navigate(`/agent-name-service/domain-details/${domain}/${permission}`, {
          state: {
            disclaimer:
              "Changes in domain permission can take upto 5 mins to take effect.",
          },
        });
      } catch (err) {
        setIsTrnsxLoading(false);
        console.error("Error updating permission:", err);
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
        navigate(`/agent-name-service/domain-details/${domain}/${permission}`);
      }
    };

    return (
      <React.Fragment>
        <div className={style["popupCard"]}>
          <h3 style={{ color: "white" }}>Add {permission}</h3>

          <AddressInput
            recipientConfig={sendConfigs.recipientConfig}
            memoConfig={sendConfigs.memoConfig}
            label={""}
            value={""}
            className={style["searchContainer"]}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {handleCancel && (
              <button
                style={{ marginTop: "10px" }}
                type="button"
                onClick={handleCancel}
              >
                cancel
              </button>
            )}
            <button
              style={{ marginTop: "10px", width: "99.41px", display: "flow" }}
              type="button"
              disabled={!!errorText}
              onClick={() => handlePermission()}
            >
              Add
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
