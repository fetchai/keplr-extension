import { HeaderLayout } from "@layouts/header-layout";
import React from "react";
import { useHistory } from "react-router";
import { Button } from "reactstrap";
import activeStake from "@assets/icon/activeStake.png";
// import Box from "@assets/svg/Box";

export const StakeComplete = () => {
  const history = useHistory();

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle="Stake"
    >
      <div className="box-image">
        <img
          // src={Box}
          alt=""
          style={{
            width: "277px",
            height: "277px",
          }}
        />
      </div>
      <div className="next-staked-info">
        <div className="next-staked-amount">
          <span className="bold-text" style={{ color: "#5090FF" }}>
            432.11111 1111 1111 KFET
          </span>
        </div>
        staked with
        <div className="next-staked-validator-name">
          heresthevalidatornamehere
        </div>
      </div>

      <Button variant="outline-primary" block onClick={() => history.push("/")}>
        Return Home
      </Button>

      <Button color="primary" block onClick={() => history.push("/stake")}>
        <img
          src={activeStake}
          alt=""
          style={{
            marginRight: "5px",
            height: "15px",
          }}
        />
        Stake Again
      </Button>
    </HeaderLayout>
  );
};
