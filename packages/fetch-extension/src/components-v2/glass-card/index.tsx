import React, { ReactNode } from "react";
import style from "./style.module.scss";

interface Prop {
  children: ReactNode;
  styleProps?: React.CSSProperties;
  onClick?: () => void;
}

export const GlassCard: React.FC<Prop> = ({
  children,
  styleProps,
  onClick,
}) => {
  return (
    <div className={style["glass"]} style={{ ...styleProps }} onClick={onClick}>
      {children}
    </div>
  );
};
