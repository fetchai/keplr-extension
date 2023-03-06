import React, { FunctionComponent } from "react";
import newstyle from "./style.module.scss";
import ReactHtmlParser from "react-html-parser";
import jazzicon from "@metamask/jazzicon";

interface Props {
  elem: any;
  handleCheck: React.ChangeEventHandler<HTMLInputElement>;
  checkBoxState: string[];
}

export const NotificationOrg: FunctionComponent<Props> = (props) => {
  const { elem, handleCheck, checkBoxState } = props;
  return (
    <div className={newstyle.listItem}>
      <input
        key={elem.id}
        onChange={handleCheck}
        type="checkbox"
        className={newstyle.checkbox}
        id={elem.id}
        checked={checkBoxState.includes(elem.id) ? true : false}
      />
      <div className={newstyle.image}>
        {ReactHtmlParser(jazzicon(28, elem.id).outerHTML)}
      </div>
      <p className={newstyle.name}>{elem.name}</p>
    </div>
  );
};
