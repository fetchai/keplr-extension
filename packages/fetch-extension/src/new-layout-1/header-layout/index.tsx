import React, { CSSProperties, FunctionComponent, useState } from "react";

import { MenuProvider, MenuContext } from "../menu";
import { Props as HeaderProps } from "../header";
import { BottomNav } from "../bottom-nav";
import style from "./style.module.scss";

export interface Props extends HeaderProps {
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  showBottomMenu?: boolean;
}

export const HeaderLayout: FunctionComponent<Props> = (props) => {
  const { children } = props;

  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuContext: MenuContext = {
    open: () => {
      setMenuOpen(true);
    },
    close: () => {
      setMenuOpen(false);
    },
    toggle: () => {
      setMenuOpen(!isMenuOpen);
    },
  };

  const containerStyles: CSSProperties = {
    transition: "filter 0.3s ease-in-out",
    position: "relative",
  };

  const bottomNavStyles: CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 200,
  };

  return (
    <MenuProvider value={menuContext}>
      <div
        style={{ ...containerStyles, ...props.style }}
        className={style["container"]}
      >
        <div className={style["innerContainer"]}>{children}</div>
      </div>
      {(props.showBottomMenu ?? true) && (
        <div style={bottomNavStyles}>
          <BottomNav />
        </div>
      )}
    </MenuProvider>
  );
};
