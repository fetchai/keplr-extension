import React from "react";
import style from "./style.module.scss";
import closeImage from "../assets/closeImage.svg";
interface DropdownProps {
  isOpen?: boolean;
  title: string;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  closeClicked: () => void;
  children: React.ReactNode;
}

export const Dropdown = ({
  children,
  title,
  setIsOpen,
  isOpen,
  closeClicked,
}: DropdownProps) => {
  return isOpen ? (
    <div>
      <div
        onClick={() => {
          closeClicked();
          if (setIsOpen) setIsOpen(false);
        }}
        className={style["overlay"]}
      />
      <div className={style["dropdownContainer"]}>
        <div className={style["header"]}>
          {title}
          <img
            src={closeImage}
            className={style["closeIcon"]}
            onClick={() => {
              closeClicked();
              if (setIsOpen) setIsOpen(false);
            }}
            alt="X"
          />
        </div>
        {children}
      </div>
    </div>
  ) : null;
};
