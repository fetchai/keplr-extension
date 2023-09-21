import React, { useCallback, useEffect, useState } from "react";
import { HeaderLayout } from "../../../../new-layouts";
import { useNavigate, useLocation } from "react-router";
import style from "../style.module.scss";

import { TooltipForDomainNames } from "../../../fetch-name-service/domain-details";
import { useNotification } from "@components/notification";
import { registerDomain, verifyDomain } from "../../../../name-service/ans-api";
import { useStore } from "../../../../stores";

export const VerifyDomain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const { domainName, agentName, verificationString } = location.state || {};
  const [isVerified, setisVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRegisterInProgress, setIsRegisterInProgress] = useState(false);
  const [approvalToken, setApprovalToken] = useState<string>("");
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);

  const handleVerifyClick = async () => {
    try {
      setIsVerifying(true);
      const result = await verifyDomain(current.chainId, domainName);
      if (!result.approval_token) throw Error(result.info);
      else {
        setApprovalToken(result.approval_token);
        setisVerified(true);
        notification.push({
          placement: "top-center",
          type: "success",
          duration: 2,
          content: `Verification of TXT record Successful`,
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      }
    } catch (error) {
      console.error("Error verifying domain:", error);
      notification.push({
        placement: "top-center",
        type: "warning",
        duration: 2,
        content: `Verification of TXT record failed!`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      setisVerified(false);
    }
    setIsVerifying(false);
  };

  const handleRegisterClick = async () => {
    try {
      const domain = domainName;
      setIsRegisterInProgress(true);
      await registerDomain(
        current.chainId,
        account,
        agentName,
        domain,
        notification,
        approvalToken
      );
      setIsRegisterInProgress(false);
      navigate(`/agent-name-service`, {
        state: {
          disclaimer:
            "New Domain additions can take upto 5 mins to take effect.",
        },
      });
    } catch (err) {
      setIsRegisterInProgress(false);
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
      if (err.toString().includes("Error: Request rejected")) {
        navigate("/agent-name-service/register-new/");
      }
    }
  };

  const handleUnload = useCallback(async () => {
    const data = {
      isVerified: isVerified,
      timestamp: Date.now(),
      pathname: window.location.hash,
      domain: domainName,
      agent: agentName,
      verification_string: verificationString,
      approval_token: approvalToken,
    };
    window.localStorage.setItem("verificationData", JSON.stringify(data));
  }, [agentName, approvalToken, domainName, isVerified, verificationString]);

  useEffect(() => {
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [handleUnload]);

  const copyVerificationString = useCallback(
    async (verificationString) => {
      try {
        await navigator.clipboard.writeText(
          "fetch-ans-token=" + verificationString
        );
        notification.push({
          placement: "top-center",
          type: "success",
          duration: 2,
          content: "Verification String copied",
          canDelete: true,
          transition: {
            duration: 0.25,
          },
        });
      } catch (error) {
        console.error("Failed to copy verification string:", error);
      }
    },
    [notification]
  );

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={""}
      onBackButton={() => {
        navigate("/agent-name-service/register-new");
      }}
      showBottomMenu={true}
    >
      {isRegisterInProgress ? (
        <div className={style["loader"]}>
          Loading Register Transaction
          <i className="fas fa-spinner fa-spin ml-2" />
        </div>
      ) : null}
      <div className={style["title"]} style={{ marginBottom: "36px" }}>
        Verify domain
      </div>
      <div style={{ color: "white", margin: "16px", fontSize: "14px" }}>
        Add this as a TXT record to{" "}
        <span className={style["domain"]}>{domainName}</span>
      </div>
      <div
        className={style["searchContainer"]}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {" "}
        <div className={style["searchInput"]}>
          {" "}
          <TooltipForDomainNames
            domainName={"fetch-ans-token=" + verificationString}
          />{" "}
        </div>
        <button
          style={{ cursor: "pointer" }}
          className={style["copy"]}
          onClick={() => copyVerificationString(verificationString)}
        >
          Copy
        </button>
      </div>
      <button
        className={style["registerButton"]}
        onClick={!isVerified ? handleVerifyClick : handleRegisterClick}
        disabled={isVerifying}
      >
        {!isVerified ? "Verify" : "Register"}
        {isVerifying ? (
          <i className="fas fa-spinner fa-spin ml-2" />
        ) : (
          <img
            src={require("@assets/svg/arrow-right.svg")}
            className={style["registerIcon"]}
            alt=""
          />
        )}
      </button>
    </HeaderLayout>
  );
};
