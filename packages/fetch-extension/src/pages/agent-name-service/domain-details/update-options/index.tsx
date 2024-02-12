import React from "react";
import style from "./style.module.scss";

interface UpdateOptionsProps {
  setIsOptionsPopupOpen: any;
  setSelectedOption: any;
}

export const UpdateOptions: React.FC<UpdateOptionsProps> = ({
  setIsOptionsPopupOpen,
  setSelectedOption,
}) => {
  return (
    <div
      onClick={() => setIsOptionsPopupOpen(false)}
      className={style["popup"]}
    >
      <div
        className={style["popup-item"]}
        onClick={() => setSelectedOption("Reset")}
      >
        Reset Domain
      </div>
      <div
        className={style["popup-item"]}
        onClick={() => setSelectedOption("Extend")}
      >
        Extend Expiration
      </div>
      <div
        className={style["popup-item"]}
        onClick={() => setSelectedOption("Remove")}
      >
        Remove Domain
      </div>
    </div>
  );
};
