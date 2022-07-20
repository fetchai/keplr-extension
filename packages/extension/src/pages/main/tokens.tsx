import React from "react";

import style from "./style.module.scss";
import mobxIcon from "../../public/assets/icon/mobx.png";
import sendIcon from "../../public/assets/icon/send.png";
import swapIcon from "../../public/assets/icon/swap.png";

interface TokenProps {
  name: string;
  balance: string;
  img: string;
}

const Token = ({ name, balance, img }: TokenProps) => {
  return (
    <div className={style.tokenContainer}>
      <img src={img} alt="mobx" className={style.tokenImg} />
      <div className={style.tokenName}>{name}</div>
      <div className={style.tokenBalance}>{balance}</div>
      <img src={sendIcon} style={{ marginRight: "16px" }} alt="send" />
      <img src={swapIcon} alt="swap" />
    </div>
  );
};

export const TokensView = () => {
  return (
    <div>
      <div className={style.tokenTitle}>Tokens</div>
      <div className={style.tokenContainnerInner}>
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
        <Token name="Mobx" balance="0.00 000 000 000 000 000" img={mobxIcon} />
      </div>
    </div>
  );
};
