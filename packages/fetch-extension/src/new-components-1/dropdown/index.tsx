import React from "react";
import style from "./style.module.scss";

interface DropdownProps {
  isOpen?: boolean;
  title: string;
  setIsOpen?: any;
  closeClicked: any;
  styleProp?: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  children,
  title,
  setIsOpen,
  isOpen,
  closeClicked,
  styleProp,
}) => {
  return isOpen ? (
    <React.Fragment>
      <div
        onClick={() => {
          closeClicked;
          setIsOpen(false);
        }}
        className={style["overlay"]}
      />
      <div style={styleProp} className={style["dropdownContainer"]}>
        <div className={style["header"]}>
          {title}
          <img
            className={style["closeIcon"]}
            onClick={() => {
              closeClicked;
              setIsOpen(false);
            }}
            src={require("@assets/svg/wireframe/closeImage.svg")}
          />
        </div>
        {children}
      </div>
    </React.Fragment>
  ) : null;
};
