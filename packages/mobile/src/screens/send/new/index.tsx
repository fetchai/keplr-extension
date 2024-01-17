import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useSendTxConfig } from "@keplr-wallet/hooks";
import { useStore } from "stores/index";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SendPhase1 } from "./send-phase-1";
import { SendPhase2 } from "./send-phase-2";

export const NewSendScreen: FunctionComponent = observer(() => {
  const [isNext, setIsNext] = useState(false);
  const { chainStore, accountStore, queriesStore } = useStore();

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          chainId?: string;
          currency?: string;
          recipient?: string;
        }
      >,
      string
    >
  >();

  const chainId = route.params.chainId
    ? route.params.chainId
    : chainStore.current.chainId;

  const account = accountStore.getAccount(chainId);

  const sendConfigs = useSendTxConfig(
    chainStore,
    queriesStore,
    accountStore,
    chainId,
    account.bech32Address,
    {
      allowHexAddressOnEthermint: true,
    }
  );

  useEffect(() => {
    if (route.params.currency) {
      const currency = sendConfigs.amountConfig.sendableCurrencies.find(
        (cur) => cur.coinMinimalDenom === route.params.currency
      );
      if (currency) {
        sendConfigs.amountConfig.setSendCurrency(currency);
      }
    }
  }, [route.params.currency, sendConfigs.amountConfig]);

  return (
    <React.Fragment>
      {isNext === false && (
        <SendPhase1 setIsNext={setIsNext} sendConfigs={sendConfigs} />
      )}
      {isNext === true && (
        <SendPhase2 sendConfigs={sendConfigs} setIsNext={setIsNext} />
      )}
    </React.Fragment>
  );
});
