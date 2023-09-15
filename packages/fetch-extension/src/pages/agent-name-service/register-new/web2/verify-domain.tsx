import React, { useCallback, useEffect, useState } from "react";
import { HeaderLayout } from "../../../../new-layouts";
import { useNavigate, useLocation } from "react-router";
import style from "../style.module.scss";
import { TooltipForDomainNames } from "../../../fetch-name-service/domain-details";
import { useNotification } from "@components/notification";

export const VerifyDomain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const { domainName, agentName, verificationString } = location.state || {};
  const [isVerified, setisVerified] = useState<boolean>(false);
  const handleVerifyClick = async () => {
    try {
      //wip
    } catch (error) {
      console.error("Error verifying domain:", error);
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
      // navigate("/agent-name-service/register-new");
    }
    setisVerified(false);
  };
  const handleUnload = useCallback(async () => {
    const data = {
      isVerified: isVerified,
      timestamp: Date.now(),
      pathname: window.location.hash,
      domain: domainName,
      agent: agentName,
      approval_token: verificationString,
    };
    window.localStorage.setItem("verificationData", JSON.stringify(data));
  }, [domainName, verificationString]);

  useEffect(() => {
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [handleUnload]);

  const copyVerificationString = useCallback(
    async (verificationString) => {
      try {
        await navigator.clipboard.writeText(verificationString);
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
          <TooltipForDomainNames domainName={verificationString} />{" "}
        </div>
        <button
          style={{ cursor: "pointer" }}
          className={style["copy"]}
          onClick={() => copyVerificationString(verificationString)}
        >
          Copy
        </button>
      </div>
      <button className={style["registerButton"]} onClick={handleVerifyClick}>
        Verify{" "}
        <img
          src={require("@assets/svg/arrow-right.svg")}
          className={style["registerIcon"]}
          alt=""
        />
      </button>
    </HeaderLayout>
  );
};
