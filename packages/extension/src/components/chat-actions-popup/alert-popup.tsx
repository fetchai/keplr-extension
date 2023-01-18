import React from "react";
import style from "./style.module.scss";
import { CommonPopupOptions } from "@chatTypes";
export const AlertPopup = ({
  heading,
  description,
  firstButtonTitle,
  secondButtonTitle,
  onClick,
}: {
  setConfirmAction: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
  description: string;
  firstButtonTitle: string;
  secondButtonTitle: string;
  onClick: (option: CommonPopupOptions) => void;
}) => {
  return (
    <>
      <div
        className={style.overlay}
        // onClick={() => onClick(CommonPopupOptions.cancel)}
      />
      <div className={style.popup}>
        <h4>{heading}</h4>
        <section>
          <p style={{ whiteSpace: "pre-wrap" }} className={style.textContainer}>
            {description}
          </p>
        </section>
        <div className={style.buttonContainer}>
          <button
            type="button"
            onClick={() => onClick(CommonPopupOptions.cancel)}
          >
            {firstButtonTitle}
          </button>
          <button
            type="button"
            className={style.btn}
            onClick={() => onClick(CommonPopupOptions.ok)}
          >
            {secondButtonTitle}
          </button>
        </div>
      </div>
    </>
  );
};
