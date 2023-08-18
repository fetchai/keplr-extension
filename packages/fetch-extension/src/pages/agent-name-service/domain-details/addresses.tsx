import React, { useState, useEffect } from "react";
import style from "../style.module.scss";
import { useLocation } from "react-router";
import { ANS_CONFIG } from "../../../config.ui.var";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";
import { formatAddressInANS } from "@utils/format";

export const Addresses = observer(() => {
  const domainName = useLocation().pathname.split("/")[3];
  const { chainStore, queriesStore } = useStore();
  const current = chainStore.current;
  const { queryDomainRecord } = queriesStore.get(current.chainId).ans;
  const { record } = queryDomainRecord.getQueryContract(
    ANS_CONFIG[current.chainId].contractAddress,
    domainName
  );
  let agentaddressofDomain: any[] = [];
  if (record !== undefined) {
    console.log(record);
    agentaddressofDomain = record.records[0].agent_address.records;
  }

  const [fetchedDetailsOfAgentAddresses, setFetchedDetailsOfAgentAddresses] =
    useState<any[]>([]);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      const fetchedDetails: any[] = [];
      for (const agent of agentaddressofDomain) {
        const fetchAgentsAddresses = await fetch(
          ANS_CONFIG[current.chainId].agentsUrl + agent.address
        );
        const agentDetails = await fetchAgentsAddresses.json();
        fetchedDetails.push(agentDetails);
      }
      setFetchedDetailsOfAgentAddresses(fetchedDetails);
      console.log(fetchedDetailsOfAgentAddresses);
    };

    if (agentaddressofDomain.length > 0) {
      fetchAgentDetails();
    }
  }, [domainName, agentaddressofDomain, current.chainId]);

  return (
    <div>
      {fetchedDetailsOfAgentAddresses.map((domains, index) => (
        <div className={style["domainCard"]} key={index}>
          <div
            style={{ display: "flex", gap: "16px" }}
            className={style["domainDetails"]}
          >
            <div>{formatAddressInANS(domains.address)}</div>
            {domains.status !== "active" ? (
              <div className={style["expired"]}>EXPIRED</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
});
