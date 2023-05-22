import React from "react";
import { FunctionComponent } from "react";
import style from "./style.module.scss";
import { GovStatusChip } from "@components/chips/gov-chip";
import { useHistory } from "react-router";
import { proposalOptions } from "../../../pages/proposals/index";

interface Props {
  title: string;
  id: string;
  status: string;
}

export const Proposal: FunctionComponent<Props> = (props) => {
  const { title, status, id } = props;
  const history = useHistory();
  let icon, color, background, name;
  if (status === proposalOptions.ProposalPassed) {
    icon = "gov-tick.svg";
    color = "#6AB77A";
    background = "#E3F4E7";
    name = "Passed";
  } else if (status === proposalOptions.ProposalActive) {
    icon = "gov-clock.svg";
    color = "#3B82F6";
    background = "#D0DEF5";
    name = "Active";
  } else {
    icon = "gov-cross.svg";
    color = "#DC6461";
    background = "#FBECEC";
    name = "Failed";
  }
  const handleClick = () => {
    history.push(`/proposal-detail/${id}`);
  };
  return (
    <div className={style.proposal} onClick={handleClick}>
      <div className={style.pContent}>
        <p className={style.pTitle}>{title}</p>
        <p className={style.pDesc}>{id}</p>
      </div>

      <div className={style.govStatus}>
        <GovStatusChip
          id={4}
          name={name}
          selectedIndex={1}
          background={background}
          icon={icon}
          color={color}
        />
      </div>
    </div>
  );
};
