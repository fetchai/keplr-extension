import React, { useState } from "react";
import style from "./style.module.scss";
import line from "../assets/Line 1.svg";
import qrCode from "../assets/qrcode.svg";
import at from "../assets/at.svg";

interface AddressInputProps {
  qrOnClick: any;
  atOnClick: any;
  qrDisabled: boolean;
  atDisabled: boolean;
}
export const AddressInput = ({
  qrOnClick,
  qrDisabled,
  atDisabled,
  atOnClick,
}: AddressInputProps) => {
  const [inputValue, setInputvalue] = useState("");
  return (
    <div className={style["container"]}>
      <div className={style["inputSection"]}>
        <div className={style["label"]}>Recipient</div>
        <input
          onChange={(e: any) => {
            setInputvalue(e.target.value);
          }}
          style={
            inputValue.length > 26 ? { height: "42px" } : { height: "25px" }
          }
          className={style["addressInput"]}
          type="text"
          placeholder="Wallet address"
          value={inputValue}
        />
      </div>
      <div className={style["rightContent"]}>
        <img src={line} alt="" />
        <button
          style={qrDisabled ? { cursor: "not-allowed" } : { cursor: "pointer" }}
          disabled={qrDisabled}
          className={style["rightContentButton"]}
          onClick={() => qrOnClick}
        >
          <img
            style={
              qrDisabled ? { cursor: "not-allowed" } : { cursor: "pointer" }
            }
            src={qrCode}
            alt=""
          />
        </button>
        <button
          disabled={atDisabled}
          className={style["rightContentButton"]}
          onClick={() => atOnClick}
        >
          <img
            style={
              atDisabled ? { cursor: "not-allowed" } : { cursor: "pointer" }
            }
            src={at}
            alt=""
          />
        </button>
      </div>
    </div>
  );
};
