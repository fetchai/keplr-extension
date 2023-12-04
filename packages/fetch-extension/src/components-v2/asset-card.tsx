import React from "react";
import styleToken from "../pages/main/token.module.scss";
import { ToolTip } from "@components/tooltip";
import { formatTokenName } from "@utils/format";
interface AssetCardProps {
  image?: any;
  name: any;
  balance?: any;
}
export const AssetCard: React.FC<AssetCardProps> = ({ image, name }) => {
  return (
    <div className={styleToken["tokenContainer"]}>
      <div className={styleToken["tokenImg"]}>
        {image ? (
          <div>
            <img
              src={image}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "100000px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "12px",
                backgroundColor: "transparent",
                border: "1px solid grey",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "100000px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFFFFF",
              fontSize: "12px",
              backgroundColor: "transparent",
              border: "1px solid grey",
            }}
          >
            {name.length > 0 ? name[0] : "?"}
          </div>
        )}
      </div>
      <div className={styleToken["tokenName"]}>
        <ToolTip trigger="hover" tooltip={name}>
          {formatTokenName(name)}
        </ToolTip>
      </div>
    </div>
  );
};
