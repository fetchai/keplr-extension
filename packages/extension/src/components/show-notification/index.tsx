import React from "react";
import { FunctionComponent } from "react";
import { useStore } from "../../stores/index";

interface Props {
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  showNotifications: boolean;
}

export const ShowNotification: FunctionComponent<Props> = (props) => {
  const whiteListedUsers: string[] = [
    "fetch1z8sx9qcpm7xq220g6e4rvvk3vh5el0wz9thqry",
    "fetch1sh7quxpfdq6j66pwftn8axh66nlw0g6j53a9js",
    "fetch1fhwymg4adeupm4gn2yft32hm63whwyfqdc5trw",
    "fetch1n8d2c36j568fvkwy6n3a6lewv43d3h4qgg073p",
    "fetch13sqgusw5z7h92g4ynctselm56566ksukh93mda",
    "fetch1kn6uqpreqh7h6fe2qh6lda3kkgm0vlev2tu3gu",
    "fetch1sv8494ddjgzhqg808umctzl53uytq50qjkjvfr",
  ];

  const { accountStore, chainStore } = useStore();
  const current = chainStore.current;

  const accountInfo = accountStore.getAccount(current.chainId);
  const walletAddress = accountInfo.bech32Address;
  const showIcon = whiteListedUsers.indexOf(walletAddress) !== -1;

  return showIcon ? (
    <div
      style={{
        height: "64px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div
        style={{ width: "16px", cursor: "pointer", margin: "0 2.5vw" }}
        onClick={(e) => {
          e.preventDefault();

          props.setShowNotifications(!props.showNotifications);
        }}
      >
        <img
          draggable={false}
          src={require("@assets/svg/bell-icon.svg")}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
