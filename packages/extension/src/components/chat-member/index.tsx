import { fromBech32 } from "@cosmjs/encoding";
import jazzicon from "@metamask/jazzicon";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import { NameAddress } from "@chatTypes";
import { formatAddress } from "../../utils/format";
import style from "./style.module.scss";

export const ChatMember = (props: { address: NameAddress }) => {
  const { name, address } = props.address;

  const handleClick = () => {};

  return (
    <div className={style.memberContainer}>
      <div className={style.initials}>
        {ReactHtmlParser(
          jazzicon(24, parseInt(fromBech32(address).data.toString(), 16))
            .outerHTML
        )}
      </div>
      <div className={style.memberInner}>
        <div className={style.name}>{formatAddress(name)}</div>
      </div>
      <div>
        <i
          className="fa fa-user-plus"
          style={{ margin: "2px 0 0 12px", cursor: "pointer" }}
          aria-hidden="true"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
