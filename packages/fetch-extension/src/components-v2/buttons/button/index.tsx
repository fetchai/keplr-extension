import React from "react";
import { Button } from "reactstrap";
import style from "./style.module.scss";

export interface Props {
  onClick: any;
  dataLoading?: any;
  gradientText?: string;
  text: string;
  disabled?: any;
  styleProps?: React.CSSProperties;
}

export const ButtonV2: React.FC<Props> = ({
  onClick,
  dataLoading,
  gradientText,
  text,
  disabled,
  styleProps,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      data-loading={dataLoading ? dataLoading : null}
      className={style["btn"]}
      style={{ width: "100%", ...styleProps }}
    >
      {text} <span className={style["gradient"]}>{gradientText}</span>
    </Button>
  );
};
