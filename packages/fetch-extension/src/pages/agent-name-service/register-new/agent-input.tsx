import React from "react";
import style from "./style.module.scss";
import searchButton from "@assets/icon/search.png";

interface AgentAddressInputProps {
  agentAddressSearchValue: string;
  handleAgentAddressInputChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  isValidAgentAddress: boolean;
  domainAvailablity: boolean;
  searchValue: string;
  isLoading: boolean;
}

export const AgentAddressInput: React.FC<AgentAddressInputProps> = ({
  agentAddressSearchValue,
  handleAgentAddressInputChange,
  isValidAgentAddress,
  domainAvailablity,
  searchValue,
  isLoading,
}) => {
  return (
    <div
      className={style["searchContainer"]}
      style={{
        border:
          !isValidAgentAddress && agentAddressSearchValue !== ""
            ? "1px solid var(--red-red-400, #D38989)"
            : "1px solid rgba(255, 255, 255, 0.4)",
        position: "absolute",
        top: "315px",
      }}
    >
      {isLoading ? (
        <i
          style={{ color: "white", width: "10px" }}
          className="fas fa-spinner fa-spin ml-2"
        />
      ) : searchValue === "" ? (
        <img src={searchButton} className={style["searchIcon"]} alt="" />
      ) : isValidAgentAddress ? (
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
        style={{ width: "244px" }}
        value={agentAddressSearchValue}
        onChange={handleAgentAddressInputChange}
        disabled={!domainAvailablity || searchValue === ""}
      />
    </div>
  );
};
