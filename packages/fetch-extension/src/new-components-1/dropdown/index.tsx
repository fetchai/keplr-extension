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
  isOpen,
}) => {
  return isOpen ? (
    <React.Fragment>
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          background: "grey",
          opacity: 0.5,
          position: "absolute",
          top: "-300px",
          left: "0px",
          zIndex: 200,
        }}
      />

      <div
        className="bottom-0 left-0 text-white"
        style={{
          zIndex: 300,
          display: "flex",
          position: "absolute",
          width: "100%",
          flexDirection: "column",
          padding: isOpen ? "24px 12px 0px 12px" : "0px",
          borderRadius: "24px 24px 0px 0px",
          background: "rgba(0, 13, 61)",
          maxHeight: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: " 0px 12px",
            fontWeight: "bold",
          }}
        >
          {title}
          <img
            style={{ cursor: "pointer", width: "24px", height: "24px" }}
            onClick={() => setIsOpen(false)}
            src={require("@assets/svg/wireframe/closeImage.svg")}
          />
        </div>

        {children}
      </div>
    </React.Fragment>
  ) : null;
};
