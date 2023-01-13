import { fromBech32 } from "@cosmjs/encoding";
import jazzicon from "@metamask/jazzicon";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { NameAddress } from "@chatTypes";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";
import classnames from "classnames";

export const ChatMember = (props: {
  address: NameAddress;
  showSelectedIcon?: boolean;
  isSelected?: boolean;
  isShowAdmin?: boolean;
  showPointer?: boolean;
  onIconClick?: VoidCallback;
  onClick?: VoidCallback;
}) => {
  const { name, address } = props.address;
  const {
    isSelected,
    isShowAdmin,
    showSelectedIcon = true,
    showPointer = false,
    onIconClick,
    onClick,
  } = props;

  return (
    <div
      className={classnames(
        style.memberContainer,
        showPointer ? style.showPointer : {}
      )}
      onClick={onClick}
    >
      <div className={style.initials}>
        {ReactHtmlParser(
          jazzicon(24, parseInt(fromBech32(address).data.toString(), 16))
            .outerHTML
        )}
      </div>
      <div className={style.memberInner}>
        <div className={style.name}>{formatAddress(name)}</div>
      </div>
      {isShowAdmin ? (
        <div className={style.name}>Admin</div>
      ) : (
        showSelectedIcon && (
          <div>
            <i
              className={!isSelected ? "fa fa-user-plus" : "fa fa-times"}
              style={{
                width: "24px",
                height: "24px",
                padding: "2px 0 0 12px",
                cursor: "pointer",
                alignItems: "end",
                alignSelf: "end",
              }}
              aria-hidden="true"
              onClick={onIconClick}
            />
          </div>
        )
      )}
    </div>
  );
};
