import React from "react";
import { Button } from "reactstrap";
import style from "./style.module.scss";

interface Props {
  onClick: any;
  dataLoading?: any;
  gradientText: string;
  text: string;
  disabled?: any;
}

export const ButtonGradient: React.FC<Props> = ({
  onClick,
  dataLoading,
  gradientText,
  text,
  disabled,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      data-loading={dataLoading ? dataLoading : null}
      className={style["btn"]}
      style={{ width: "100%" }}
    >
      {text} <span className={style["gradient"]}>{gradientText}</span>
    </Button>
  );
};
