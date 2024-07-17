import React, { ReactNode } from "react";
import style from "./style.module.scss";

interface Prop {
  children: ReactNode;
}
export const GlassCardGradient: React.FC<Prop> = ({ children }) => {
  return (
    <div className={style["glass-gradient"]}>
      <div
        style={{
          background: "#04153D",
          borderRadius: "16px",
        }}
      >
        <div className={style["glass"]}>{children}</div>
      </div>
    </div>
  );
};
