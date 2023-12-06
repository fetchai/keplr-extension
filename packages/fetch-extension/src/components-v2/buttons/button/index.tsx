import React from "react";
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
    <button
      disabled={disabled}
      onClick={onClick}
      data-loading={dataLoading ? dataLoading : null}
      className={style["btn"]}
      style={{ ...styleProps }}
    >
      {text} <span className={style["gradient"]}>{gradientText}</span>
    </button>
  );
};
