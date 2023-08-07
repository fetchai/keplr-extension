import React from "react";
import { agentDomainAddresses } from "../../../name-service/constants";
import style from "../style.module.scss";
export const Addresses = () => {
  return (
    <div>
      {agentDomainAddresses.map((domains, index) => (
        <div className={style["domainCard"]} key={index}>
          <div
            style={{ display: "flex", gap: "16px" }}
            className={style["domainDetails"]}
          >
            <div>{domains.name}</div>
            {domains.isExpired ? (
              <div className={style["expired"]}>EXPIRED</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
