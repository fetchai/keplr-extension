import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { HeaderLayout } from "../../../new-layouts";
import { useStore } from "../../../stores";
import { useNavigate } from "react-router";
import searchButton from "@assets/icon/search.png";
import PublicDomainDropdown from "./public-domains-dropdown";
import {
  getAllAgentDomains,
  registerDomain,
} from "../../../name-service/ans-api";
import { useNotification } from "@components/notification";
import { ANS_CONFIG, ANS_TRNSX_AMOUNT } from "../../../config.ui.var";
import { observer } from "mobx-react-lite";
export const RegisterAgentDomains = observer(() => {
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [agentAddressSearchValue, setAgentAddressSearchValue] = useState("");
  const [isDomainUnavailable, setIsDomainUnavailable] = useState(false);
  const [isAgentAddressUnavailable, _setIsAgentAddressUnavailable] =
    useState(false);
  // const [isValidAgent, setIsValidAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();
  const {
    queryPublicDomains,
    queryPermissions,
    queryDomainRecord,
    queryVaildateAgentAddress,
  } = queriesStore.get(current.chainId).ans;
  const { publicDomains = [] } = queryPublicDomains.getQueryContract(
    ANS_CONFIG[current.chainId].contractAddress
  );
  let domainAvailablityMessage;
  let domainAvailablity = false;
  function checkDomainRegistration(domain: string) {
    const currentChainId = current.chainId;
    const contractAddress = ANS_CONFIG[currentChainId].contractAddress;
    const parts = domain.split(".");

    let permissionsQueryDomain;
    let statusQueryDomain;
    console.log(parts);
    if (parts.length === 2) {
      // Case 1: domain is abc.agent
      permissionsQueryDomain = domain;
      statusQueryDomain = domain;
    } else if (parts.length > 2) {
      // Case 2 and 3: domain is abc.bcd.agent or abc.bcd.def.agent
      permissionsQueryDomain = parts.slice(parts.length - 2).join(".");
      statusQueryDomain = parts.slice(0, parts.length - 1).join(".");
    } else {
      console.log(`Invalid domain: ${domain}`);
      return;
    }

    const { permissions } = queryPermissions.getQueryContract(
      contractAddress,
      account.bech32Address,
      permissionsQueryDomain
    );

    if (permissions === "admin") {
      const { isAvailable } = queryDomainRecord.getQueryContract(
        contractAddress,
        statusQueryDomain
      );
      if (isAvailable) {
        domainAvailablityMessage = `You have permissions and the domain ${domain} is available.`;
        domainAvailablity = true;
      } else {
        domainAvailablityMessage = `You have permissions, but the domain ${domain} is not available.`;
        domainAvailablity = false;
      }
    } else {
      domainAvailablityMessage = `You do not own the permissions to register ${domain}.`;
      domainAvailablity = false;
    }
  }
  checkDomainRegistration(searchValue);

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
  const { isValid: isValidAgentAddress } =
    queryVaildateAgentAddress.getQueryContract(
      ANS_CONFIG[current.chainId].validateAgentAddressContract,
      agentAddressSearchValue
    );
  console.log(isValidAgentAddress, "add");
  const handleAgentAddressInputChange = (e: any) => {
    const value = e.target.value;
    setAgentAddressSearchValue(value);
  };

  const handleRegisterClick = async () => {
    try {
      await registerDomain(
        account,
        agentAddressSearchValue,
        searchValue,
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
  const handleDomainSelect = (selectedDomain: string) => {
    setSearchValue(`${searchValue}.${selectedDomain}`);
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
        {" "}
        {isLoading ? (
          <i
            style={{ color: "white" }}
            className="fas fa-spinner fa-spin ml-2"
          />
        ) : searchValue === "" ? (
          <img src={searchButton} className={style["searchIcon"]} alt="" />
        ) : isDomainUnavailable || !domainAvailablity ? (
          <div className={style["domainTakenIcon"]}>!</div>
        ) : (
          <img
            src={require("@assets/svg/agent-domain-available.svg")}
            className={style["availableIcon"]}
            alt=""
          />
        )}
        <input
          className={style["searchInput"]}
          placeholder="Search a domain"
          type="text"
          value={searchValue}
          onChange={handleInputChange}
        />
        <PublicDomainDropdown
          publicDomains={publicDomains}
          onSelectDomain={handleDomainSelect}
        />
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
        {" "}
        {isLoading ? (
          <i
            style={{ color: "white" }}
            className="fas fa-spinner fa-spin ml-2"
          />
        ) : searchValue === "" ? (
          <img src={searchButton} className={style["searchIcon"]} alt="" />
        ) : isAgentAddressUnavailable || isValidAgentAddress ? (
          <img
            src={require("@assets/svg/agent-domain-available.svg")}
            className={style["availableIcon"]}
            alt=""
          />
        ) : (
          <div className={style["domainTakenIcon"]}>!</div>
        )}
        <input
          className={style["searchInput"]}
          placeholder="Enter Agent Address"
          type="text"
          value={agentAddressSearchValue}
          onChange={handleAgentAddressInputChange}
          disabled={isDomainUnavailable || searchValue === ""}
        />
      </div>
      {!isValidAgentAddress && agentAddressSearchValue !== "" && (
        <div className={style["domainTakenText"]}>
          <div className={style["domainTakenIcon2"]}>!</div>Agent name does not
          exist
        </div>
      )}
      {
        <div style={{ color: "white", fontSize: "smaller" }}>
          {domainAvailablityMessage}
        </div>
      }
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
