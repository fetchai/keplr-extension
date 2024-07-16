import { GlassCard } from "@components-v2/glass-card";
import React from "react";
import style from "./style.module.scss";
import { ProposalDurationRow } from "./proposal-duration-row";
import { ProposalType } from "../../../../@types/proposal-type";

export const GovtProposalRow = ({ proposal }: { proposal: ProposalType }) => {
  const { content, voting_start_time, voting_end_time, status, proposal_id } =
    proposal;

  return (
    <GlassCard
      styleProps={{
        borderRadius: "12px",
      }}
    >
      <div className={style["govt-proposal-row-container"]}>
        <div className={style["top-div"]}>
          <div
            className={style["proposal-number"]}
          >{`Proposal #${proposal_id}`}</div>
          <div className={style["proposal-title"]}>{content.title}</div>
        </div>

        <ProposalDurationRow
          voting_start_time={voting_start_time}
          voting_end_time={voting_end_time}
          status={status}
        />
      </div>
    </GlassCard>
  );
};
