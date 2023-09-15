import React, { useState } from "react";
import style from "../style.module.scss";
import { observer } from "mobx-react-lite";
import { ANS_CONFIG } from "../../../../config.ui.var";
import { useStore } from "../../../../stores";
import searchButton from "@assets/icon/search.png";
import { useNavigate } from "react-router";
import { useNotification } from "@components/notification";
import {
  makeArbitrarySignDoc,
  encodeLengthPrefixed,
  makeVerificationString,
} from "@utils/ans-v2-utils";
import { createHash } from "crypto";
import { AgentAddressInput } from "../agent-input";
export const Web2 = observer(() => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { chainStore, accountStore, queriesStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);
  const { queryDomainRecord, queryVaildateAgentAddress } = queriesStore.get(
    current.chainId
  ).ans;
  const [searchValue, setSearchValue] = useState("");
  const [agentAddressSearchValue, setAgentAddressSearchValue] = useState("");
  let signDoc: any;

  function generateDomainDigest(domain: string, address: any) {
    const hasher = createHash("sha256");
    hasher.update(encodeLengthPrefixed(domain));
    hasher.update(encodeLengthPrefixed(address));
    return hasher.digest();
  }

  function makeDomainSignDoc(signerAddress: any, domain: any) {
    const digest = generateDomainDigest(domain, signerAddress);
    return makeArbitrarySignDoc(signerAddress, digest, current.chainId);
  }

  let domainAvailablityMessage;
  let domainAvailablity = false;

  const handleAgentAddressInputChange = (e: any) => {
    const value = e.target.value;
    setAgentAddressSearchValue(value);
  };
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
  };
  const { isFetching: isLoading, isValid: isValidAgentAddress } =
    queryVaildateAgentAddress.getQueryContract(
      ANS_CONFIG[current.chainId].validateAgentAddressContract,
      agentAddressSearchValue
    );
  function checkDomain(domain: string) {
    const currentChainId = current.chainId;
    const contractAddress = ANS_CONFIG[currentChainId].contractAddress;
    const parts = domain.split(".");

    if (parts.length === 2) {
      const { isAvailable, record } = queryDomainRecord.getQueryContract(
        contractAddress,
        domain
      );
      if (isAvailable && !record) {
        domainAvailablityMessage = `The domain is available`;
        domainAvailablity = true;
      } else {
        domainAvailablityMessage = `The domain is not available`;
        domainAvailablity = false;
      }
      return;
    } else {
      domainAvailablityMessage = `Invalid domain`;
      return;
    }
  }
  checkDomain(searchValue);
  const handleRegisterClick = async () => {
    try {
      const domain = searchValue;
      let verificationString;
      signDoc = makeDomainSignDoc(account.bech32Address, domain);
      const signedTxResponse = await window.keplr?.signAmino(
        current.chainId,
        account.bech32Address,
        signDoc
      );
      if (signedTxResponse && signedTxResponse.signature) {
        verificationString = makeVerificationString(
          signedTxResponse.signature.signature,
          account.pubKey
        );
      }
      navigate("/agent-name-service/register-new/verify-domain", {
        state: {
          domainName: domain,
          agentName: agentAddressSearchValue,
          verificationString: verificationString,
        },
      });
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
      navigate("/agent-name-service/register-new");
    }
  };
  return (
    <React.Fragment>
      <div
        className={style["searchContainer"]}
        style={{
          border:
            !domainAvailablity &&
            searchValue !== "" &&
            searchValue.includes(".")
              ? "1px solid var(--red-red-400, #D38989)"
              : "1px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        {isLoading ? (
          <i
            style={{ color: "white", width: "10px" }}
            className="fas fa-spinner fa-spin ml-2"
          />
        ) : searchValue === "" ? (
          <img src={searchButton} className={style["searchIcon"]} alt="" />
        ) : !domainAvailablity ? (
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
      </div>
      {!domainAvailablity && searchValue !== "" && (
        <div
          style={{ position: "absolute", top: "283px" }}
          className={style["domainTakenText"]}
        >
          <div className={style["domainTakenIcon2"]}>!</div>
          {domainAvailablityMessage}
        </div>
      )}
      <AgentAddressInput
        agentAddressSearchValue={agentAddressSearchValue}
        handleAgentAddressInputChange={handleAgentAddressInputChange}
        isValidAgentAddress={isValidAgentAddress}
        domainAvailablity={domainAvailablity}
        searchValue={searchValue}
        isLoading={isLoading}
      />
      <button
        className={style["registerButton"]}
        disabled={!domainAvailablity || !isValidAgentAddress}
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
    </React.Fragment>
  );
});
