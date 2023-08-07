import React, { useState, useEffect } from "react";
import style from "../style.module.scss";
import { useNavigate } from "react-router";
import { getDomainOwners } from "../../../name-service/ans-api";

export const Permissions = () => {
  const [activeInnerTab, setActiveInnerTab] = useState("Owners");
  const [ownerArray, setOwnerArray] = useState<any>();
  const [writerArray, setWriterArray] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleInnerTabChange = (tabName: any) => {
    setActiveInnerTab(tabName);
  };

  const handleCancelOnClick = () => {
    console.log("Cancel clicked", ownerArray);
  };
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);

      const ownerResult: any = await getDomainOwners();
      setOwnerArray(ownerResult);

      const writerResult: any = await getDomainOwners();
      setWriterArray(writerResult);

      setIsLoading(false);
    };
    getData();
  }, []);

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
        ) : ownerArray ? (
          activeInnerTab === "Owners" &&
          ownerArray.map((domains: any, index: any) => (
            <div className={style["domainCard"]} key={index}>
              <div className={style["domainDetails"]}>
                <div className={style["agentDomainData"]}>
                  {domains.current && (
                    <div className={style["currentWallet"]}>
                      {domains.current === true ? "CURRENT WALLET" : null}
                    </div>
                  )}
                  {domains.address}
                </div>
                <div
                  onClick={handleCancelOnClick}
                  className={style["cancel"]}
                  style={{ width: "12px", height: "18px" }}
                >
                  X
                </div>
              </div>
            </div>
          ))
        ) : null}
        {!isLoading && writerArray
          ? activeInnerTab === "Writers" &&
            writerArray.map((domains: any, index: any) => (
              <div className={style["domainCard"]} key={index}>
                <div className={style["domainDetails"]}>
                  <div>{domains.address}</div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};
