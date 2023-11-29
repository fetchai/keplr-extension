import React, { useMemo } from "react";
import style from "./style.module.scss";
import { useNavigate } from "react-router";
import { useStore } from "../../stores";
import { Dec } from "@keplr-wallet/unit";
import { observer } from "mobx-react-lite";
import { CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB } from "../../config.ui.var";
import { WalletActionsButton } from "../../new-components-1/buttons/wallet-action-button";

export const WalletActions = observer(() => {
  const navigate = useNavigate();

  const { accountStore, chainStore, queriesStore } = useStore();
  const accountInfo = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);
  const queryBalances = queries.queryBalances.getQueryBech32Address(
    accountInfo.bech32Address
  );
  const hasAssets =
    queryBalances.balances.find((bal) => bal.balance.toDec().gt(new Dec(0))) !==
    undefined;
  const isEvm = chainStore.current.features?.includes("evm") ?? false;
  const isStakableInApp = [CHAIN_ID_DORADO, CHAIN_ID_FETCHHUB].includes(
    chainStore.current.chainId
  );
  const stakable = queries.queryBalances.getQueryBech32Address(
    accountInfo.bech32Address
  ).stakable;
  const isStakableExist = useMemo(() => {
    return stakable.balance.toDec().gt(new Dec(0));
  }, [stakable.balance]);
  console.log(isStakableExist);

  return (
    <div className={style["actions"]}>
      <WalletActionsButton
        title="Recieve"
        image="arrow-down.svg"
        onClick={() => navigate("/receive")}
      />
      <WalletActionsButton
        title="Send"
        image="arrow-up.svg"
        onClick={() => {
          if (hasAssets) {
            navigate("/send-new");
          }
        }}
      />
      {isStakableInApp && (
        <WalletActionsButton
          title="Stake"
          image="stake.svg"
          onClick={() =>
            navigate(
              isStakableInApp
                ? "/validators/validator"
                : chainStore.current.walletUrlForStaking || ""
            )
          }
        />
      )}
      <WalletActionsButton
        title="Bridge"
        image="bridge.svg"
        onClick={() => {
          if (isEvm) {
            navigate("/axl-bridge-evm");
          } else {
            navigate("/axl-bridge-cosmos");
          }
        }}
      />
    </div>
  );
});
