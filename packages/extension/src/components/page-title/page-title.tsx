import React, { FunctionComponent } from "react";
import style from "./style.module.scss";
interface Props {
  headingValue: string;
}
export const PageTitle: FunctionComponent<Props> = (props) => {
  const { headingValue } = props;
  return <div className={style.heading}>{headingValue}</div>;
};
