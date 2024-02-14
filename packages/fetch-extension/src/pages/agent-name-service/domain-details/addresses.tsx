import { formatAddressInANS } from "@utils/format";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { getAgentAddressByDomain } from "../../../name-service/ans-api";
import { useStore } from "../../../stores";
import style from "../style.module.scss";
import style1 from "./permissions/style.module.scss";
import { OptionConfirmationPopup } from "./update-options/option-confirmation-popup";

export const Addresses = observer(
  ({
    domainName,
    setIsTrnsxLoading,
  }: {
    domainName: string;
    setIsTrnsxLoading: any;
  }) => {
    const { chainStore } = useStore();
    const current = chainStore.current;

    const [agentAddresses, setAgentAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isTrnsxLoading, setIsTrnsxLoading] = useState<boolean>(true);

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    useEffect(() => {
      const fetchAgentDetails = async () => {
        try {
          setIsLoading(true);
          const response = await getAgentAddressByDomain(
            current.chainId,
            domainName
          );
          setAgentAddresses(response);
        } catch (e) {
          console.error("Error fetching data:", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAgentDetails();
    }, [domainName, current.chainId]);

    if (isLoading) {
      return (
        <div className={style["loader"]}>
          Loading agents <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      );
    }
    return (
      <div>
        <div
          onClick={() => setIsPopupOpen(!isPopupOpen)}
          className={style1["add"]}
          style={{ marginLeft: "280px", width: "35px" }}
        >
          <img
            className={style1["pen"]}
            src={require("@assets/svg/Pen.svg")}
            alt=""
          />
        </div>
        {isPopupOpen && (
          <OptionConfirmationPopup
            domain={domainName}
            setIsTrnsxLoading={setIsTrnsxLoading}
            selectedOption={"Update"}
            handleCancel={() => setIsPopupOpen(false)}
          />
        )}
        {agentAddresses.length ? (
          agentAddresses.map((agent, index) => {
            const isExpired = new Date(agent.expiry).getTime() < Date.now();
            return (
              <div className={style["domainCard"]} key={index}>
                <div
                  style={{ display: "flex", gap: "16px" }}
                  className={style["domainDetails"]}
                >
                  <div>{formatAddressInANS(agent.address)}</div>
                  {isExpired ? (
                    <div className={style["expired"]}>EXPIRED</div>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", color: "white" }}>
            No Agents Available
          </div>
        )}
      </div>
    );
  }
);
