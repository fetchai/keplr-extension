import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { NativeTab } from "./native";
import style from "./style.module.scss";
import { useStore } from "../../../stores";
import { NativeEthTab } from "./native-eth";

export const Activity: FunctionComponent = observer(() => {
  const { chainStore } = useStore();
  const isEvm = chainStore.current.features?.includes("evm") ?? false;
  return (
    <div className={style["container"]}>
      {isEvm ? <NativeEthTab /> : <NativeTab />}
    </div>
  );
});
