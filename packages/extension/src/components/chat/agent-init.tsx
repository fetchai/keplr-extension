import privacyIcon from "@assets/hello.png";
import React from "react";
import { useHistory } from "react-router";
import { AGENT_ADDRESS } from "../../config.ui.var";
import style from "./style.module.scss";

export const AgentInit = () => {
  const history = useHistory();
  // address book values

  return (
    <div className={style.agentContainer}>
      <img src={privacyIcon} />
      <br />
      <div className={style.infoContainer}>
        <h3>We have just added Agents!</h3>
        <p>
          Now you can chat with an autonomous agent to ask questions and perform
          wallet functions.
        </p>
      </div>
      <button
        type="button"
        onClick={() => history.replace("/agent/" + AGENT_ADDRESS)}
      >
        Talk to an Agent
      </button>
    </div>
  );
};
