import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Button } from "reactstrap";

import { HeaderLayout } from "@layouts/index";

import style from "./style.module.scss";

import { useStore } from "../../stores";

import classnames from "classnames";
import { DataTab } from "./data-tab";
import { DetailsTab } from "./details-tab";
import { FormattedMessage, useIntl } from "react-intl";

import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  useFeeConfig,
  useMemoConfig, useSenderConfig,
  useSignDocAmountConfig,
  useSignDocHelper, useTxConfigsValidate,
  useZeroAllowedGasConfig
} from "@keplr-wallet/hooks";
import { ADR36SignDocDetailsTab } from "./adr-36";
import { ChainIdHelper } from "@keplr-wallet/cosmos";
import { unescapeHTML } from "@keplr-wallet/common";
import { EthSignType } from "@keplr-wallet/types";
import { useInteractionInfo } from "@hooks/interaction";
import { SignInteractionStore } from "@keplr-wallet/stores";
import { handleCosmosPreSign } from "@keplr-wallet/extension/src/pages/sign/utils/handle-cosmos-sign";
import { useUnmount } from "@keplr-wallet/extension/src/hooks/use-unmount";

enum Tab {
  Details,
  Data,
}

export const SignPage: FunctionComponent = observer(() => {
  const { signInteractionStore } = useStore();

  useInteractionInfo(() => {
    signInteractionStore.rejectAll();
  });

  return (
    <React.Fragment>
      {signInteractionStore.waitingData ? (
        <SignPageImpl
          key={signInteractionStore.waitingData.id}
          interactionData={signInteractionStore.waitingData}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i className="fas fa-spinner fa-spin fa-2x text-gray" />
        </div>
      )}
    </React.Fragment>
  );
});

export const SignPageImpl: FunctionComponent<{
  interactionData: NonNullable<SignInteractionStore["waitingData"]>;
}> = observer(({ interactionData }) => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>(Tab.Details);

  const intl = useIntl();

  const {
    chainStore,
    keyRingStore,
    signInteractionStore,
    accountStore,
    queriesStore,
    uiConfigStore
  } = useStore();

  const [signer, setSigner] = useState("");
  const [origin, setOrigin] = useState<string | undefined>();
  const [isADR36WithString, setIsADR36WithString] = useState<
    boolean | undefined
  >();
  const [ethSignType, setEthSignType] = useState<EthSignType | undefined>();

  const current = chainStore.current;
  const senderConfig = useSenderConfig(chainStore, current.chainId, signer);
  // There are services that sometimes use invalid tx to sign arbitrary data on the sign page.
  // In this case, there is no obligation to deal with it, but 0 gas is favorably allowed.
  const gasConfig = useZeroAllowedGasConfig(chainStore, current.chainId, 0);
  const amountConfig = useSignDocAmountConfig(
    chainStore,
    current.chainId,
    senderConfig
  );
  const feeConfig = useFeeConfig(
    chainStore,
    queriesStore,
    current.chainId,
    senderConfig,
    amountConfig,
    gasConfig
  );
  const memoConfig = useMemoConfig(chainStore, current.chainId);

  const signDocHelper = useSignDocHelper(feeConfig, memoConfig);
  amountConfig.setSignDocHelper(signDocHelper);

  useEffect(() => {
      chainStore.selectChain(interactionData.data.chainId);
      if (interactionData.data.signDocWrapper.isADR36SignDoc) {
        setIsADR36WithString(interactionData.data.isADR36WithString);
      }
      if (interactionData.data.ethSignType) {
        setEthSignType(interactionData.data.ethSignType);
      }
      setOrigin(interactionData.data.origin);
      if (
        !interactionData.data.signDocWrapper.isADR36SignDoc &&
        interactionData.data.chainId !== interactionData.data.signDocWrapper.chainId
      ) {
        // Validate the requested chain id and the chain id in the sign doc are same.
        // If the sign doc is for ADR-36, there is no chain id in the sign doc, so no need to validate.
        throw new Error("Chain id unmatched");
      }
      signDocHelper.setSignDocWrapper(interactionData.data.signDocWrapper);
      gasConfig.setValue(interactionData.data.signDocWrapper.gas);
      let memo = interactionData.data.signDocWrapper.memo;
      if (interactionData.data.signDocWrapper.mode === "amino") {
        // For amino-json sign doc, the memo is escaped by default behavior of golang's json marshaller.
        // For normal users, show the escaped characters with unescaped form.
        // Make sure that the actual sign doc's memo should be escaped.
        // In this logic, memo should be escaped from account store or background's request signing function.
        memo = unescapeHTML(memo);
      }
      memoConfig.setValue(memo);
      // if (
      //   data.data.signOptions.preferNoSetFee &&
      //   data.data.signDocWrapper.fees[0]
      // ) {
      //   const fee = data.data.signDocWrapper.fees[0];
      //   feeConfig.setFee(new CoinPretty(fee.denom, fee.amount));
      //
      // }
      amountConfig.setDisableBalanceCheck(
        !!interactionData.data.signOptions.disableBalanceCheck
      );
      feeConfig.setDisableBalanceCheck(
        !!interactionData.data.signOptions.disableBalanceCheck
      );
      if (
        interactionData.data.signDocWrapper.granter &&
        interactionData.data.signDocWrapper.granter !== interactionData.data.signer
      ) {
        feeConfig.setDisableBalanceCheck(true);
      }
      setSigner(interactionData.data.signer);
  }, [
    amountConfig,
    chainStore,
    gasConfig,
    memoConfig,
    feeConfig,
    signDocHelper,
  ]);

  // If the preferNoSetFee or preferNoSetMemo in sign options is true,
  // don't show the fee buttons/memo input by default
  // But, the sign options would be removed right after the users click the approve/reject button.
  // Thus, without this state, the fee buttons/memo input would be shown after clicking the approve buttion.
  const [isProcessing, setIsProcessing] = useState(false);
  const needSetIsProcessing =
    interactionData?.data.signOptions.preferNoSetFee ===
      true ||
    interactionData?.data.signOptions.preferNoSetMemo === true;

  const preferNoSetFee =
    interactionData?.data.signOptions.preferNoSetFee ===
      true || isProcessing;
  const preferNoSetMemo =
    interactionData?.data.signOptions.preferNoSetMemo ===
      true || isProcessing;

  const interactionInfo = useInteractionInfo(
    () => {
      if (needSetIsProcessing) {
        setIsProcessing(true);
      }

      signInteractionStore.rejectAll();
    }
  );

  const currentChainId = chainStore.current.chainId;
  const currentChainIdentifier = useMemo(
    () => ChainIdHelper.parse(currentChainId).identifier,
    [currentChainId]
  );
  const selectedChainId = chainStore.selectedChainId;
  const selectedChainIdentifier = useMemo(
    () => ChainIdHelper.parse(selectedChainId).identifier,
    [selectedChainId]
  );

  // Check that the request is delivered
  // and the chain is selected properly.
  // The chain store loads the saved chain infos including the suggested chain asynchronously on init.
  // So, it can be different the current chain and the expected selected chain for a moment.
  const isLoaded = (() => {
    if (!signDocHelper.signDocWrapper) {
      return false;
    }

    return currentChainIdentifier === selectedChainIdentifier;
  })();

  // If this is undefined, show the chain name on the header.
  // If not, show the alternative title.
  const alternativeTitle = (() => {
    if (!isLoaded) {
      return "";
    }

    if (
      signDocHelper.signDocWrapper &&
      signDocHelper.signDocWrapper.isADR36SignDoc &&
      !ethSignType
    ) {
      return "Prove Ownership";
    }

    return undefined;
  })();



  const [unmountPromise] = useState(() => {
    let resolver: () => void;
    const promise = new Promise<void>((resolve) => {
      resolver = resolve;
    });

    return {
      promise,
      resolver: resolver!,
    };
  });

  useUnmount(() => {
    unmountPromise.resolver();
  });

  const isLedgerAndDirect =
    interactionData.data.keyType === "ledger" &&
    interactionData.data.mode === "direct";

  const txConfigsValidate = useTxConfigsValidate({
    senderConfig,
    gasConfig,
    amountConfig,
    feeConfig,
    memoConfig,
  });

  const approveIsDisabled = (() => {
    if (!isLoaded || txConfigsValidate.interactionBlocked || !signDocHelper.signDocWrapper || isLedgerAndDirect) {
      return true;
    }

    // If the sign doc is for ADR-36,
    // there is no error related to the fee or memo...
    if (signDocHelper.signDocWrapper.isADR36SignDoc) {
      return false;
    }

    return memoConfig.uiProperties.error != null || feeConfig.uiProperties.error != null;
  })();

  const approve = async (e: any) => {
    e.preventDefault();
    if (needSetIsProcessing) {
      setIsProcessing(true);
    }
    if (signDocHelper.signDocWrapper) {
      try {
        const signature = await handleCosmosPreSign(
          uiConfigStore.useWebHIDLedger,
          interactionData,
          signDocHelper.signDocWrapper
        );

        await signInteractionStore.approveWithProceedNext(
          interactionData.id,
          signDocHelper.signDocWrapper,
          signature,
          async (proceedNext) => {
            if (!proceedNext) {
              if (
                interactionInfo.interaction &&
                !interactionInfo.interactionInternal
              ) {
                window.close();
              }
            }

            if (
              interactionInfo.interaction &&
              interactionInfo.interactionInternal
            ) {
              // XXX: 약간 난해한 부분인데
              //      내부의 tx의 경우에는 tx 이후의 routing을 요청한 쪽에서 처리한다.
              //      하지만 tx를 처리할때 tx broadcast 등의 과정이 있고
              //      서명 페이지에서는 이러한 과정이 끝났는지 아닌지를 파악하기 힘들다.
              //      만약에 밑과같은 처리를 하지 않으면 interaction data가 먼저 지워지면서
              //      화면이 깜빡거리는 문제가 발생한다.
              //      이 문제를 해결하기 위해서 내부의 tx는 보내는 쪽에서 routing을 잘 처리한다고 가정하고
              //      페이지를 벗어나고 나서야 data를 지우도록한다.
              await unmountPromise.promise;
            }
          },
          {
            // XXX: 단지 special button의 애니메이션을 보여주기 위해서 delay를 넣음...ㅋ;
            preDelay: 200,
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <HeaderLayout
      showChainName={alternativeTitle == null}
      alternativeTitle={alternativeTitle != null ? alternativeTitle : undefined}
      canChangeChainInfo={false}
      onBackButton={
        interactionInfo.interactionInternal
          ? () => {
              navigate(-1);
            }
          : undefined
      }
      style={{ background: "white", minHeight: "100%" }}
      innerStyle={{ display: "flex", flexDirection: "column" }}
    >
        /*
         Show the informations of tx when the sign data is delivered.
         If sign data not delivered yet, show the spinner alternatively.
         */
          <div className={style["container"]}>
            <div className={classnames(style["tabs"])}>
              <ul>
                <li className={classnames({ active: tab === Tab.Details })}>
                  <a
                    className={style["tab"]}
                    onClick={() => {
                      setTab(Tab.Details);
                    }}
                  >
                    {intl.formatMessage({
                      id: "sign.tab.details",
                    })}
                  </a>
                </li>
                <li className={classnames({ active: tab === Tab.Data })}>
                  <a
                    className={style["tab"]}
                    onClick={() => {
                      setTab(Tab.Data);
                    }}
                  >
                    {intl.formatMessage({
                      id: "sign.tab.data",
                    })}
                  </a>
                </li>
              </ul>
            </div>
            <div
              className={classnames(style["tabContainer"], {
                [style["dataTab"]]: tab === Tab.Data,
              })}
            >
              {tab === Tab.Data ? (
                <DataTab signDocHelper={signDocHelper} />
              ) : null}
              {tab === Tab.Details ? (
                signDocHelper.signDocWrapper?.isADR36SignDoc ? (
                  <ADR36SignDocDetailsTab
                    signDocWrapper={signDocHelper.signDocWrapper}
                    isADR36WithString={isADR36WithString}
                    ethSignType={ethSignType}
                    origin={origin}
                  />
                ) : (
                  <DetailsTab
                    signDocHelper={signDocHelper}
                    memoConfig={memoConfig}
                    feeConfig={feeConfig}
                    gasConfig={gasConfig}
                    isInternal={
                      interactionInfo.interaction &&
                      interactionInfo.interactionInternal
                    }
                    preferNoSetFee={preferNoSetFee}
                    preferNoSetMemo={preferNoSetMemo}
                    isNeedLedgerEthBlindSigning={
                      ethSignType === EthSignType.EIP712 &&
                      accountStore.getAccount(current.chainId).isNanoLedger
                    }
                  />
                )
              ) : null}
            </div>
            <div className={style["buttons"]}>
              {keyRingStore.selectedKeyInfo?.type === "ledger" &&
              signInteractionStore.isObsoleteInteraction(interactionData?.id) ? (
                <Button
                  className={style["button"]}
                  color="primary"
                  disabled={true}
                  outline
                >
                  <FormattedMessage id="sign.button.confirm-ledger" />{" "}
                  <i className="fa fa-spinner fa-spin fa-fw" />
                </Button>
              ) : (
                <React.Fragment>
                  <Button
                    className={style["button"]}
                    color="danger"
                    disabled={signDocHelper.signDocWrapper == null}
                    data-loading={signInteractionStore.isObsoleteInteraction(interactionData?.id)}
                    onClick={async (e) => {
                      e.preventDefault();

                      if (needSetIsProcessing) {
                        setIsProcessing(true);
                      }

                      await signInteractionStore.rejectAll();

                      if (
                        interactionInfo.interaction &&
                        !interactionInfo.interactionInternal
                      ) {
                        window.close();
                      }
                    }}
                    outline
                  >
                    {intl.formatMessage({
                      id: "sign.button.reject",
                    })}
                  </Button>
                  <Button
                    className={style["button"]}
                    color="primary"
                    disabled={approveIsDisabled}
                    data-loading={signInteractionStore.isObsoleteInteraction(interactionData?.id)}
                    onClick={approve}
                  >
                    {intl.formatMessage({
                      id: "sign.button.approve",
                    })}
                  </Button>
                </React.Fragment>
              )}
            </div>
          </div>
    </HeaderLayout>
  );
});
