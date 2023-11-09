import React from "react";
interface DropdownProps {
  isOpen?: boolean;
  title: string;
  setIsOpen: any;
}
export const Dropdown: React.FC<DropdownProps> = ({
  children,
  title,
  setIsOpen,
  isOpen
}) => {
  return (
    <div
      style={{
        color: "white",
        width: "100%",
        padding: "24px 12px 0px 12px",
        borderRadius: "24px 24px 0px 0px",
        background: "rgba(0, 13, 61, 0.80)",
        height: isOpen ? "400px" : "0px"
      }}
    >
      {isOpen && <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: " 0px 12px",
          fontWeight: "bold",

        }}
      >
        {title}{" "}
        <img
          style={{ cursor: "pointer", width: "24px", height: "24px" }}
          onClick={() => setIsOpen(false)}
          src={require("@assets/svg/wireframe/closeImage.svg")}
        />{" "}
      </div>}
      {isOpen && children}
    </div>
  );
};
