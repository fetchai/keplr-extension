import React, { FunctionComponent } from "react";
import style from "./style.module.scss";

interface Props {
  name: string;
}
export const NotificationOption: FunctionComponent<Props> = (props) => {
  const { name } = props;
  return (
    <div className={style.notificationOptionContainer}>
      <label className={style.switch}>
        <input type="checkbox" defaultChecked />
        <span className={style.slider} />
      </label>

      <p className={style.notificationOption}>{name}</p>
    </div>
  );
};
