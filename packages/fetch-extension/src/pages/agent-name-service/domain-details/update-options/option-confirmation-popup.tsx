import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../../../stores";
import style from "../confirmation-popup/style.module.scss";
import { ExtendDomainExpiration } from "./extend-expiration";
import { ResetDomain } from "./reset-domain";
import { RemoveDomain } from "./remove-domain";
import { UpdateAgentRecords } from "./update-domain-record";

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
    const { chainStore, accountStore } = useStore();
    const current = chainStore.current;
    const account = accountStore.getAccount(current.chainId);

    return (
      <div className={style["popupCard"]}>
        {selectedOption === "Remove" && (
          <RemoveDomain
            domain={domain}
            setIsTrnsxLoading={setIsTrnsxLoading}
            account={account}
            handleCancel={handleCancel}
            chainId={current.chainId}
          />
        )}
        {selectedOption === "Extend" && (
          <ExtendDomainExpiration
            domain={domain}
            setIsTrnsxLoading={setIsTrnsxLoading}
            account={account}
            handleCancel={handleCancel}
            chainId={current.chainId}
          />
        )}
        {selectedOption === "Reset" && (
          <ResetDomain
            domain={domain}
            setIsTrnsxLoading={setIsTrnsxLoading}
            chainStore={chainStore}
            accountStore={accountStore}
            handleCancel={handleCancel}
          />
        )}
        {selectedOption === "Update" && (
          <UpdateAgentRecords
            domain={domain}
            setIsTrnsxLoading={setIsTrnsxLoading}
            handleCancel={handleCancel}
          />
        )}
      </div>
    );
  }
);
