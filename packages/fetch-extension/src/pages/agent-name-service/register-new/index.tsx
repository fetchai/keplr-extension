import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { HeaderLayout } from "../../../new-layouts";
import { useStore } from "../../../stores";
import { useNavigate } from "react-router";
import searchButton from "@assets/icon/search.png";
import {
  getAllAgentDomains,
  registerDomain,
} from "../../../name-service/ans-api";
import { useNotification } from "@components/notification";
import { ANS_TRNSX_AMOUNT } from "../../../config.ui.var";
import { observer } from "mobx-react-lite";

export const RegisterAgentDomains = observer(() => {
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [agentAddressSearchValue, setAgentAddressSearchValue] = useState("");
  const [isDomainUnavailable, setIsDomainUnavailable] = useState(false);
  const [isAgentAddressUnavailable, _setIsAgentAddressUnavailable] =
    useState(false);
  const [isValidAgent, setIsValidAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();
  const parseAgentName = (agentName: string): string => {
    const agentSuffix = ".agent";
    const trimmedAgentName = agentName.trim();
    if (!trimmedAgentName.endsWith(agentSuffix)) {
      return trimmedAgentName + agentSuffix;
    }
    return trimmedAgentName;
  };

  const isValidAgentAddress = (address: string) => {
    address = address.trim();
    if (address.startsWith("agent") && address.length === 65) {
      const regex = /^[a-zA-Z0-9]+$/;
      return regex.test(address);
    }
    return false;
  };

  useEffect(() => {
    setIsLoading(true);
    getAllAgentDomains().then((domainsArray: any) => {
      setIsDomainUnavailable(domainsArray.includes(searchValue));
      setIsLoading(false);
    });
  }, [searchValue]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleAgentAddressInputChange = (e: any) => {
    const value = e.target.value;
    setIsValidAgent(isValidAgentAddress(value));
    setAgentAddressSearchValue(value);
  };

  const handleRegisterClick = async () => {
    try {
      await registerDomain(
        account,
        agentAddressSearchValue,
        parseAgentName(searchValue),
        ANS_TRNSX_AMOUNT,
        notification
      );
      navigate("/");
    } catch (err) {
      console.error("Error minting domain:", err);
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
      navigate("/");
    }
  };

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={""}
      onBackButton={() => {
        navigate("/agent-name-service");
      }}
      showBottomMenu={true}
    >
      <div className={style["registerTitle"]}>Register new domain</div>
      <div
        className={style["searchContainer"]}
        style={{
          border: isDomainUnavailable
            ? "1px solid var(--red-red-400, #D38989)"
            : "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <input
          className={style["searchInput"]}
          placeholder="Search a domain"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
        />
        {isLoading ? (
          <i
            style={{ color: "white" }}
            className="fas fa-spinner fa-spin ml-2"
          />
        ) : searchValue === "" ? (
          <img src={searchButton} className={style["searchIcon"]} alt="" />
        ) : isDomainUnavailable ? (
          <div className={style["domainTakenIcon"]}>!</div>
        ) : (
          <img
            src={require("@assets/svg/agent-domain-available.svg")}
            className={style["availableIcon"]}
            alt=""
          />
        )}
      </div>
      {isDomainUnavailable && (
        <div className={style["domainTakenText"]}>
          <div className={style["domainTakenIcon2"]}>!</div>This domain is taken
        </div>
      )}
      <div
        className={style["searchContainer"]}
        style={{
          border: isDomainUnavailable
            ? "1px solid var(--red-red-400, #D38989)"
            : "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        <input
          className={style["searchInput"]}
          placeholder="Enter Agent Address"
          type="text"
          value={agentAddressSearchValue}
          onChange={handleAgentAddressInputChange}
          disabled={isDomainUnavailable || searchValue === ""}
        />
        {isLoading ? (
          <i
            style={{ color: "white" }}
            className="fas fa-spinner fa-spin ml-2"
          />
        ) : searchValue === "" ? (
          <img src={searchButton} className={style["searchIcon"]} alt="" />
        ) : isAgentAddressUnavailable || isValidAgent ? (
          <img
            src={require("@assets/svg/agent-domain-available.svg")}
            className={style["availableIcon"]}
            alt=""
          />
        ) : (
          <div className={style["domainTakenIcon"]}>!</div>
        )}
      </div>
      {isAgentAddressUnavailable ||
        (!isValidAgent && agentAddressSearchValue !== "" && (
          <div className={style["domainTakenText"]}>
            <div className={style["domainTakenIcon2"]}>!</div>Agent name does
            not exist
          </div>
        ))}

      <button
        className={style["registerButton"]}
        onClick={() => {
          handleRegisterClick();
        }}
      >
        Register{" "}
        <img
          src={require("@assets/svg/arrow-right.svg")}
          className={style["registerIcon"]}
          alt=""
        />
      </button>
    </HeaderLayout>
  );
});
