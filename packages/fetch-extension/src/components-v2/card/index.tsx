import React from "react";
import styles from "./style.module.scss";

export interface CardProps {
  leftImage?: any;
  heading: any;
  subheading?: any;
  rightContent?: any;
  isActive?: boolean;
  style?: any;
  subheadingStyle?: any;
  onClick?: any;
  rightContentOnClick?: any;
  rightContentStyle?: any;
}

export const Card: React.FC<CardProps> = ({
  leftImage,
  heading,
  subheading,
  rightContent,
  rightContentStyle,
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
          {/* Updated to allow any React element */}
          {React.isValidElement(rightContent) ? (
            <div style={rightContentStyle}> {rightContent}</div>
          ) : // Check for Chrome extension link
          rightContent && rightContent.includes("chrome-extension://") ? (
            <img
              onClick={rightContentOnClick}
              src={rightContent}
              alt="Right Section"
              className={styles["rightImage"]}
              style={rightContentStyle}
            />
          ) : (
            <div onClick={rightContentOnClick} className={styles["rightText"]}>
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
