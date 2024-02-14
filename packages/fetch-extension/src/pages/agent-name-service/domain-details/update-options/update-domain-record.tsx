import { useNotification } from "@components/notification";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { updateRecord } from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";
import style from "./style.module.scss";
import { AgentAddressInput } from "../../register-new/agent-input";
import { ANS_CONFIG } from "../../../../config.ui.var";
interface UpdateAgentRecordsProps {
  handleCancel: any;
  domain: string;
  setIsTrnsxLoading: any;
}
export const UpdateAgentRecords: React.FC<UpdateAgentRecordsProps> = observer(
  ({ handleCancel, domain, setIsTrnsxLoading }) => {
    const { chainStore, accountStore, queriesStore } = useStore();
    const notification = useNotification();
    const current = chainStore.current;
    const navigate = useNavigate();
    const [agentAddress, setAgentAddress] = useState("");
    const account = accountStore.getAccount(current.chainId);

    const { queryVaildateAgentAddress } = queriesStore.get(current.chainId).ans;
    const { isFetching: isLoading, isValid: isValidAgentAddress } =
      queryVaildateAgentAddress.getQueryContract(
        ANS_CONFIG[current.chainId].validateAgentAddressContract,
        agentAddress
      );
    const handleAgentAddressInputChange = (e: any) => {
      const value = e.target.value;
      setAgentAddress(value);
    };
    const domainAvailablity = false;

    const handleUpdateRecord = async () => {
      try {
        setIsTrnsxLoading(true);
        updateRecord(
          current.chainId,
          account,
          domain,
          notification,
          agentAddress
        );
        navigate(`/agent-name-service`, {
          state: {
            disclaimer:
              "Updating Domain record can take upto 5 mins to take effect.",
          },
        });
        setIsTrnsxLoading(false);
      } catch (err) {
        console.error("Error Updating Domain record:", err);
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
        navigate(`/agent-name-service/domain-details/${domain}/owner`);
      }
    };

    return (
      <React.Fragment>
        <h4 style={{ color: "white" }}>
          Are you sure you want to updtae agent record for {domain} ?
        </h4>
        <AgentAddressInput
          agentAddressSearchValue={agentAddress}
          handleAgentAddressInputChange={handleAgentAddressInputChange}
          isValidAgentAddress={isValidAgentAddress}
          domainAvailablity={domainAvailablity}
          isLoading={isLoading}
          styleProp={{ width: "269px", margin: "0px" }}
        />
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
            disabled={!isValidAgentAddress}
            className={style["options-button"]}
            type="button"
            onClick={handleUpdateRecord}
          >
            UPDATE
          </button>
        </div>
      </React.Fragment>
    );
  }
);
