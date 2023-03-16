import React, { CSSProperties, FunctionComponent, useState } from "react";

import { MenuProvider, MenuContext } from "../menu";

import { Header, Props as HeaderProps } from "../header";
import { BottomNav } from "../bottom-nav";

import style from "./style.module.scss";
import { NotificationModal } from "@components/notification-modal/index";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props extends HeaderProps {
  style?: CSSProperties;
  showBottomMenu?: boolean;
  showNotifications?: boolean;
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

  return (
    <MenuProvider value={menuContext}>
      <div className={style.container} style={props.style}>
        <Header {...props} isMenuOpen={isMenuOpen} />
        <div className={style.innerContainer}>{children}</div>

        {(props.showBottomMenu ?? true) && <BottomNav />}

        {props.showNotifications && <NotificationModal />}
      </div>
    </MenuProvider>
  );
};
