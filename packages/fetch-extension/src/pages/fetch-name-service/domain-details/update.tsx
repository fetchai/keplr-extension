import { useNotification } from "@components/notification";
import React from "react";
import { useNavigate } from "react-router";
import { FNS_CONFIG } from "../../../config.ui.var";
import { setPrimary, updateDomain } from "../../../name-service/fns-apis";
import { useStore } from "../../../stores";
import style from "./style.module.scss";
interface UpdateProps {
  domainPrice: any;
  domainName: string;
  domainData: any;
  isOwned: boolean;
  isAssigned: boolean;
  isPrimary: boolean;
}

export const Update: React.FC<UpdateProps> = ({
  domainName,
  domainData,
  isOwned,
  isAssigned,
  isPrimary,
}) => {
  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const account = accountStore.getAccount(current.chainId);
  const navigate = useNavigate();
  const notification = useNotification();

  const handleMakePrimary = async () => {
    try {
      await setPrimary(current.chainId, account, domainName);
      navigate("/fetch-name-service");
      notification.push({
        placement: "top-center",
        type: "primary",
        duration: 2,
        content: `transaction braodcasted!`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
    } catch (error) {
      console.error("Error making domain as primary:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDomain(current.chainId, account, domainName, domainData);

      notification.push({
        placement: "top-center",
        type: "primary",
        duration: 2,
        content: `transaction braodcasted!`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
    } catch (error) {
      console.error("Error making domain as primary:", error);
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
    }
    navigate("/fetch-name-service");
  };

  const handleClick = () => {
    const url = `https://www.fetns.domains/domains/${domainName}`;
    window.open(url, "_blank");
  };

  return (
    <div className={style["buttonGroup"]}>
      {isAssigned && !isPrimary && (
        <button
          className={style["mint"]}
          style={{
            marginRight: "10px",
            backgroundColor: "#1c0032",
            border: "1px solid #9075ff",
          }}
          onClick={
            FNS_CONFIG[current.chainId].isEditable
              ? handleMakePrimary
              : handleClick
          }
        >
          <span className={style["domainName"]}>Make Primary</span>
        </button>
      )}
      {isOwned && (
        <button
          className={style["mint"]}
          onClick={
            FNS_CONFIG[current.chainId].isEditable ? handleUpdate : handleClick
          }
        >
          <span className={style["domainName"]}>Update</span>
        </button>
      )}
    </div>
  );
};
