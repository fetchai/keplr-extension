import { HeaderLayout } from "@layouts/header-layout";
import React from "react";
import { useHistory } from "react-router";
import { Button, Input } from "reactstrap";
import activeStake from "@assets/icon/activeStake.png";
import "./stake.scss";
// import { TokenDropdown } from "@components/agents/tokens-dropdown";
import { ValidatorDropdown } from "@components/form/validators-input";

export const Stake = () => {
  const history = useHistory();

  const stakeClicked = () => {
    console.log(history);
    history.push("/stake-complete");
  };

  const goBack = () => {
    history.replace("/");
    console.log("back clicked");
  };
  const validatorList: string[] = ["validator1", "validator2", "validator3"];

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
      onBackButton={goBack}
    >
      <div>
        <ValidatorDropdown label={"Validators"} validators={validatorList} />
      </div>
      <div className="staked-amount-container">
        <div className="staked-amount-content">
          <div className="label">Current Staked Amount</div>
          <div className="fet-text">0 FET</div>
        </div>
      </div>
      <label>Stake Value</label>
      <div className="stake-value-container">
        <Input
          type="number"
          value="0 FET"
          placeholder="0 FET"
          // onChange={handleChange}
          style={{ borderRadius: "0%" }}
          className="stake-value-input"
        />
      </div>
      <div className="stake-form">
        <div className="next-staked-amount-info">
          Next Staked Amount
          <div className="next-staked-amount" style={{ fontWeight: "bold" }}>
            {"0 FET"}
          </div>
          <div className="estimated-return">
            Estimated Return
            <div className="estimated-return-item">
              <div className="duration">Daily</div>
              <div className="value">0 FET</div>
            </div>
            <div className="estimated-return-item">
              <div className="duration">Monthly</div>
              <div className="value">0 FET</div>
            </div>
            <div className="estimated-return-item">
              <div className="duration">Yearly</div>
              <div className="value">0 FET</div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          color="primary"
          block
          style={{ alignItems: "end" }}
          onClick={stakeClicked}
        >
          <img
            src={activeStake}
            alt=""
            style={{
              marginRight: "5px",
              height: "15px",
            }}
          />
          Stake
        </Button>
      </div>
    </HeaderLayout>
  );
};
