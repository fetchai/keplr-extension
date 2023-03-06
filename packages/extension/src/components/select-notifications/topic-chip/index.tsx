import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

interface Props {
  topic: any;
  checked: boolean;
  handleCheck: React.ChangeEventHandler<HTMLInputElement>;
}
export const Chip: FunctionComponent<Props> = (props) => {
  const { handleCheck, checked, topic } = props;
  return (
    <span className={style.topicChips}>
      <label className={style.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheck}
          id={topic.name}
        />
        <span className={style.contentInverter}>{topic.name}</span>
      </label>
    </span>
  );
};
