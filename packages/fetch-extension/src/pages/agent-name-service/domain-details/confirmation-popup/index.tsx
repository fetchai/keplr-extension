import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router";
import { updateDomainPermissions } from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";
import style from "./style.module.scss";
import { formatAddress } from "@utils/format";

export const ConfirmationPopup = observer(
  ({
    handleCancel,
    permission,
    domain,
    address,
    setIsTrnsxLoading,
  }: {
    handleCancel?: any;
    permission: string;
    domain: string;
    address?: string;
    setIsTrnsxLoading: any;
  }) => {
    const { chainStore, accountStore } = useStore();
    const notification = useNotification();
    const current = chainStore.current;
    const navigate = useNavigate();
    const account = accountStore.getAccount(current.chainId);

    const handlePermission = async () => {
      try {
        setIsTrnsxLoading(true);
        await updateDomainPermissions(
          account,
          address,
          domain,
          "deny",
          notification
        );
        navigate(`/agent-name-service/domain-details/${domain}/${permission}`, {
          state: {
            disclaimer:
              "Changes in domain permission can take upto 5 mins to take effect.",
          },
        });
        setIsTrnsxLoading(false);
      } catch (err) {
        setIsTrnsxLoading(false);
        console.error("Error updating permissions:", err);
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
        <div
          className={style["popupCard"]}
          style={{ display: !address ? "none" : "" }}
        >
          <h4 style={{ color: "white" }}>
            Are you sure you want to revoke {permission} permission from{" "}
            {formatAddress(address || "")}?
          </h4>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
              style={{ marginTop: "10px", width: "99.41px", display: "flow" }}
              type="button"
              onClick={() => handlePermission()}
            >
              Revoke
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
