import { formatActivityHash } from "@utils/format";
import React from "react";
import style from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { StatusButton } from "@components-v2/status-button";

const cardStatus = (status: string) => {
  switch (status) {
    case "ABSTAIN":
      return "Pending";

    case "NO":
      return "Failed";

    case "YES":
      return "Success";

    case "NO_WITH_VETO":
      return "Failed";

    default:
      return "Active";
  }
};

const cardStatusTitle = (details: string) => {
  switch (details) {
    case "ABSTAIN":
      return "Abstain";

    case "NO":
      return "No";

    case "YES":
      return "Yes";

    case "NO_WITH_VETO":
      return "No With Veto";

    default:
      return "Active";
  }
};

const getHash = (proposal: any) => {
  if (proposal && proposal.id) {
    return formatActivityHash(proposal.id);
  }
  return null;
};

export const ActivityRow = observer(({ node }: { node: any }) => {
  const details = node.option;
  const hash = getHash(node);
  const { status, id } = node.transaction;
  return (
    <React.Fragment>
      <a
        href={`https://www.mintscan.io/fetchai/tx/${id}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className={style["activityRow"]}>
          <div className={style["middle"]}>
            <div className={style["activityCol"]}>{hash}</div>
            <div className={style["rowSubtitle"]}>
              {/* {`PROPOSAL #30`}
              {" ● "} */}
              {status === "Success" ? "Confirmed" : "Failed"}
            </div>
          </div>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <StatusButton
              status={cardStatus(details)}
              title={cardStatusTitle(details)}
            />
          </div>
        </div>
      </a>
      <div className={style["hr"]} />
    </React.Fragment>
  );
});
