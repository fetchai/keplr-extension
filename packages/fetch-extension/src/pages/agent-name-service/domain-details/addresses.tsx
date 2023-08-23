import { formatAddressInANS } from "@utils/format";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { ANS_CONFIG } from "../../../config.ui.var";
import { useStore } from "../../../stores";
import style from "../style.module.scss";

export const Addresses = observer(({ domainName }: { domainName: string }) => {
  const { chainStore, queriesStore } = useStore();
  const current = chainStore.current;
  const { queryDomainRecord } = queriesStore.get(current.chainId).ans;
  const { record } = queryDomainRecord.getQueryContract(
    ANS_CONFIG[current.chainId].contractAddress,
    domainName
  );

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
    };
    let agentaddressofDomain: any[] = [];
    if (record !== undefined) {
      agentaddressofDomain = record.records[0].agent_address.records;
    }
    if (agentaddressofDomain.length > 0) {
      fetchAgentDetails();
    }
  }, [domainName, current.chainId, record]);

  return (
    <div>
      {fetchedDetailsOfAgentAddresses.map((domains, index) => {
        const isExpired = new Date(domains.expiry).getTime() < Date.now();
        return (
          <div className={style["domainCard"]} key={index}>
            <div
              style={{ display: "flex", gap: "16px" }}
              className={style["domainDetails"]}
            >
              <div>{formatAddressInANS(domains.address)}</div>
              {isExpired ? (
                <div className={style["expired"]}>EXPIRED</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
});
