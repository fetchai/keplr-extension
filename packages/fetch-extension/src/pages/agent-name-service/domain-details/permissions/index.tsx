import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { useLocation } from "react-router";
import { useStore } from "../../../../stores";
import { ANS_CONFIG } from "../../../../config.ui.var";
import { PermissionsPopup } from "../permissions-popup";
import { observer } from "mobx-react-lite";
import { AddressList } from "./address-list";
interface PermissionsProps {
  setIsTrnsxLoading: any;
}
export const Permissions: React.FC<PermissionsProps> = observer(
  ({ setIsTrnsxLoading }) => {
    const [activeInnerTab, setActiveInnerTab] = useState("owner");
    const [owners, setOwners] = useState<string[]>([]);
    const [writers, setWriters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const domainName = useLocation().pathname.split("/")[3];

    const { chainStore, accountStore } = useStore();
    const current = chainStore.current;
    const account = accountStore.getAccount(current.chainId);

    const handleOpenPopup = () => {
      setIsPopupOpen(true);
    };
    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };
    const handleInnerTabChange = (tabName: string) => {
      setActiveInnerTab(tabName);
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
          setOwners(owners);
          setWriters(writers);
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
              onClick={() => handleInnerTabChange("owner")}
              className={
                activeInnerTab === "owner" ? style["active"] : style["inactive"]
              }
            >
              Owners
            </button>
            <button
              onClick={() => handleInnerTabChange("writer")}
              className={
                activeInnerTab === "writer"
                  ? style["active"]
                  : style["inactive"]
              }
            >
              Writers
            </button>
          </div>
          <button
            onClick={() => {
              handleOpenPopup();
            }}
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
          ) : activeInnerTab === "owner" ? (
            owners.length > 0 ? (
              <AddressList
                domain={domainName}
                addresses={owners}
                isAdmin={owners.some((owner) => owner == account.bech32Address)}
              />
            ) : (
              <div>No Owners Available</div>
            )
          ) : activeInnerTab === "writer" ? (
            writers.length > 0 ? (
              <AddressList
                domain={domainName}
                addresses={writers}
                isWriter={true}
                isAdmin={owners.some((owner) => owner == account.bech32Address)}
              />
            ) : (
              <div style={{ textAlign: "center", color: "white" }}>
                No Writers Available
              </div>
            )
          ) : null}
          {isPopupOpen && (
            <PermissionsPopup
              handleCancel={handleClosePopup}
              permission={activeInnerTab}
              domain={domainName}
              setIsTrnsxLoading={setIsTrnsxLoading}
              setIsPopupOpen={setIsPopupOpen}
            />
          )}
        </div>
      </div>
    );
  }
);
