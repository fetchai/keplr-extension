// Text.tsx
import React from "react";
import styles from "./style.module.scss";

interface TextProps {
  children: React.ReactNode;
  size?: "extra-small" | "small" | "medium" | "large" | "extra-large";
  color?: "white" | "grey";
  currencyView?: boolean;
}

const separateNumericAndDenom = (value: string) => {
  const [numericPart, alphabeticPart] = value.split(" ");
  return { numericPart, alphabeticPart };
};

export const Text = ({
  children,
  size = "medium",
  color = "white",
  currencyView = false,
}: TextProps) => {
  const textSize = {
    "extra-small": styles["extraSmall"],
    small: styles["small"],
    medium: styles["medium"],
    large: styles["large"],
    "extra-large": styles["extraLarge"],
  };

  const textColor = color === "white" ? "#FFF" : "rgba(255, 255, 255, 0.6)";
  const currencyViewStyles = currencyView
    ? {
        numeric: {
          fontSize: "32px",
          color: "#FFF",
        },
        alphabetic: {
          fontSize: "16px",
          color: "rgba(255, 255, 255, 0.60)",
        },
      }
    : {};

  return (
    <div
      className={`${styles["text"]} ${textSize[size]}`}
      style={{ color: textColor }}
    >
      {currencyView
        ? React.Children.map(children, (child, index) => {
            if (typeof child === "string") {
              const { numericPart, alphabeticPart } =
                separateNumericAndDenom(child);
              return (
                <div key={index}>
                  <span style={currencyViewStyles.numeric}>{numericPart} </span>
                  <span style={currencyViewStyles.alphabetic}>
                    {alphabeticPart}
                  </span>
                </div>
              );
            } else {
              return child;
            }
          })
        : children}
    </div>
  );
};
