import activeStake from "@assets/icon/activeStake.png";
import { ValidatorDropdown } from "@components/form/validators-input";
import { HeaderLayout } from "@layouts/header-layout";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, FormGroup, Input } from "reactstrap";
import "./stake.scss";

export const Stake = () => {
  const history = useHistory();

  const stakeClicked = () => {
    history.push("/stake-complete");
  };

  const validatorList: string[] = ["validator1", "validator2", "validator3"];

  const [stakeInput, setStakeInput] = useState<string>();

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
      onBackButton={() => history.goBack()}
    >
      <ValidatorDropdown label={"Validators"} validators={validatorList} />
      <div className="staked-amount-container">
        <div className="staked-amount-content">
          <div>Current Staked Amount</div>
          <div
            style={{ fontWeight: "bold", color: 0 > 0 ? "#3b82f6" : "black" }}
          >
            0 FET
          </div>
        </div>
      </div>
      <FormGroup style={{ borderRadius: "0%", marginBottom: "16px" }}>
        <b>Stake Value</b>
        <Input
          type="number"
          value={stakeInput}
          placeholder="0 FET"
          onChange={(e) => setStakeInput(e.target.value)}
          style={{ borderRadius: "0%" }}
          className="stake-value-input"
        />
      </FormGroup>

      <div className="next-staked-amount-info">
        Next Staked Amount
        <div
          style={{
            fontWeight: "bold",
            color: parseFloat(stakeInput || "0") > 0 ? "#3b82f6" : "black",
          }}
        >
          {stakeInput || "0"} FET
        </div>
        <div className="estimated-return">
          Estimated Return
          <div className="estimated-return-item">
            <div className="duration">Daily</div>
            <div
              style={{
                fontWeight: "bold",
                color: parseFloat(stakeInput || "0") > 0 ? "#3b82f6" : "black",
              }}
            >
              0 FET
            </div>
          </div>
          <div className="estimated-return-item">
            <div className="duration">Monthly</div>
            <div
              style={{ fontWeight: "bold", color: 0 > 0 ? "#3b82f6" : "black" }}
            >
              0 FET
            </div>
          </div>
          <div className="estimated-return-item">
            <div className="duration">Yearly</div>
            <div
              style={{ fontWeight: "bold", color: 0 > 0 ? "#3b82f6" : "black" }}
            >
              0 FET
            </div>
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
    </HeaderLayout>
  );
};
