import React from "react";
import style from "../style.module.scss";

export const Stats = () => {
  return (
    <div className={style["card"]}>
      <div>STAKING</div>
      <div className={style["bar-graph"]}></div>
    </div>
  );
};
