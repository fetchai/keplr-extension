import React from "react";
import styles from "./style.module.scss";

interface CardProps {
  leftImage?: any;
  heading: any;
  subheading?: any;
  rightContent: any;
  isActive?: boolean;
  style?: any;
  subheadingStyle?: any;
  onClick?: any;
  rightContentOnClick?: any;
}

export const Card: React.FC<CardProps> = ({
  leftImage,
  heading,
  subheading,
  rightContent,
  isActive,
  style,
  subheadingStyle,
  onClick,
  rightContentOnClick,
}) => {
  return (
    <div
      style={{
        backgroundColor: isActive ? "var(--Indigo---Fetch, #5F38FB)" : "",
        ...style,
      }}
      className={styles["cardContainer"]}
      onClick={onClick}
    >
      {leftImage &&
        (leftImage.length > 1 ? (
          <img
            src={leftImage.length > 1 && leftImage}
            alt={leftImage[0]}
            className={styles["leftImage"]}
          />
        ) : (
          <div className={styles["leftImage"]}>{leftImage}</div>
        ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className={styles["middleSection"]}>
          <div className={`${styles["heading"]} ${styles["wordBreak"]}`}>
            {heading}
          </div>
          {subheading && (
            <div
              className={styles["subHeading"]}
              style={{ ...subheadingStyle }}
            >
              {subheading}
            </div>
          )}
        </div>

        <div className={styles["rightSection"]}>
          {!rightContent.includes("chrome-extension://") ? (
            <div onClick={rightContentOnClick} className={styles["rightText"]}>
              {rightContent}
            </div>
          ) : (
            <img
              onClick={rightContentOnClick}
              src={rightContent}
              alt="Right Section"
              className={styles["rightImage"]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
