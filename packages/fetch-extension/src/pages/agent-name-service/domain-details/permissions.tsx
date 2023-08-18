import React, { useState, useEffect } from "react";
import style from "../style.module.scss";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "../../../stores";
import { ANS_CONFIG } from "../../../config.ui.var";
import { formatAddressInANS } from "@utils/format";

export const Permissions = () => {
  const [activeInnerTab, setActiveInnerTab] = useState("Owners");
  const [ownerArray, setOwnerArray] = useState<string[]>([]);
  const [writerArray, setWriterArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const domainName = useLocation().pathname.split("/")[3];

  const navigate = useNavigate();
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);

  const handleInnerTabChange = (tabName: string) => {
    setActiveInnerTab(tabName);
  };

  const handleCancelOnClick = () => {
    console.log("Cancel clicked", ownerArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const owners: string[] = [];
        const writers: string[] = [];
        const fetchDomains = await fetch(
          `${ANS_CONFIG[current.chainId].domainDetailsUrl}${domainName}`
        );
        const response = await fetchDomains.json();
        response.forEach((domain: any) => {
          if (domain.permissions === "admin") {
            owners.push(domain.account_address);
          } else if (domain.permissions === "writer") {
            writers.push(domain.account_address);
          }
        });
        setOwnerArray(owners);
        setWriterArray(writers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [domainName]);

  return (
    <div>
      <div className={style["tabContainer"]}>
        <div className={style["innerTab"]}>
          <button
            onClick={() => handleInnerTabChange("Owners")}
            className={
              activeInnerTab === "Owners" ? style["active"] : style["inactive"]
            }
          >
            Owners
          </button>
          <button
            onClick={() => handleInnerTabChange("Writers")}
            className={
              activeInnerTab === "Writers" ? style["active"] : style["inactive"]
            }
          >
            Writers
          </button>
        </div>{" "}
        <button
          disabled
          onClick={() => navigate("/agent-name-service/register-new")}
          className={style["add"]}
        >
          +
        </button>
      </div>
      <div>
        {isLoading ? (
          <div className={style["loader"]} style={{ top: "150px" }}>
            Loading Owners..
            <i className="fas fa-spinner fa-spin ml-2" />
          </div>
        ) : activeInnerTab === "Owners" ? (
          ownerArray.length > 0 ? (
            ownerArray.map((address: string, index: number) => (
              <div className={style["domainCard"]} key={index}>
                <div className={style["domainDetails"]}>
                  <div className={style["agentDomainData"]}>
                    {address === account.bech32Address && (
                      <div className={style["currentWallet"]}>
                        CURRENT WALLET
                      </div>
                    )}
                    {formatAddressInANS(address)}
                  </div>
                  <div
                    onClick={handleCancelOnClick}
                    className={style["cancel"]}
                    style={{ width: "12px", height: "18px" }}
                  >
                    X
                  </div>
                </div>{" "}
              </div>
            ))
          ) : (
            <div className={style["loader"]} style={{ top: "180px" }}>
              No Owners Available
            </div>
          )
        ) : activeInnerTab === "Writers" ? (
          writerArray.length > 0 ? (
            writerArray.map((address: string, index: number) => (
              <div className={style["domainCard"]} key={index}>
                <div className={style["domainDetails"]}>
                  <div className={style["agentDomainData"]}>
                    {address === account.bech32Address && (
                      <div className={style["currentWallet"]}>
                        CURRENT WALLET
                      </div>
                    )}
                    {formatAddressInANS(address)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={style["loader"]} style={{ top: "180px" }}>
              No Writers Available
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
