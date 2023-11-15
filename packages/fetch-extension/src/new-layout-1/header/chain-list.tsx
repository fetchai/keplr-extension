import classnames from "classnames";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { store } from "@chatStore/index";
import {
  resetChatList,
  setIsChatSubscriptionActive,
} from "@chatStore/messages-slice";
import { resetUser } from "@chatStore/user-slice";
// import { useConfirm } from "@components/confirm";
import { messageAndGroupListenerUnsubscribe } from "@graphQL/messages-api";
import { useStore } from "../../stores";
import style from "./chain-list.module.scss";
// import { ChainInfoWithCoreTypes } from "@keplr-wallet/background";
import { resetProposals } from "@chatStore/proposal-slice";
import { Card } from "../../new-components-1/card";
import { ButtonGradient } from "../../new-components-1/button-gradient";

// const ChainElement: FunctionComponent<{
//   chainInfo: ChainInfoWithCoreTypes;
// }> = observer(({ chainInfo }) => {
//   const { chainStore, analyticsStore } = useStore();
//   const navigate = useNavigate();
//   const intl = useIntl();

//   const confirm = useConfirm();

//   return (
//     <>
//       {console.log(chainInfo)}
//       {/* <Card heading={"chainInfo.chainId"} rightContent={undefined} /> */}
//       <div
//         className={classnames({
//           [style["chainName"]]: true,
//           selected: chainInfo.chainId === chainStore.current.chainId,
//         })}
//         onClick={() => {
//           let properties = {};
//           if (chainInfo.chainId !== chainStore.current.chainId) {
//             properties = {
//               chainId: chainStore.current.chainId,
//               chainName: chainStore.current.chainName,
//               toChainId: chainInfo.chainId,
//               toChainName: chainInfo.chainName,
//             };
//           }
//           chainStore.selectChain(chainInfo.chainId);
//           chainStore.saveLastViewChainId();
//           store.dispatch(resetUser({}));
//           store.dispatch(resetProposals({}));

//           store.dispatch(resetChatList({}));
//           store.dispatch(setIsChatSubscriptionActive(false));
//           messageAndGroupListenerUnsubscribe();
//           navigate("/");
//           if (Object.values(properties).length > 0) {
//             analyticsStore.logEvent("Chain changed", properties);
//           }
//         }}
//       >
//         {chainInfo.chainName}
//         {!chainInfo.embeded &&
//         chainStore.current.chainId !== chainInfo.chainId ? (
//           <div className={style["removeBtn"]}>
//             <i
//               className="fas fa-times-circle"
//               onClick={async (e) => {
//                 e.preventDefault();
//                 e.stopPropagation();

//                 if (
//                   await confirm.confirm({
//                     paragraph: intl.formatMessage(
//                       {
//                         id: "chain.remove.confirm.paragraph",
//                       },
//                       {
//                         chainName: chainInfo.chainName,
//                       }
//                     ),
//                   })
//                 ) {
//                   await chainStore.removeChainInfo(chainInfo.chainId);
//                 }
//               }}
//             />
//           </div>
//         ) : null}
//       </div>
//     </>
//   );
// });

export const ChainList: FunctionComponent = observer(() => {
  const { chainStore, analyticsStore } = useStore();
  const intl = useIntl();
  const navigate = useNavigate();

  const mainChainList = chainStore.chainInfosInUI.filter(
    (chainInfo) => !chainInfo.beta && !chainInfo.features?.includes("evm")
  );

  const evmChainList = chainStore.chainInfosInUI.filter((chainInfo) =>
    chainInfo.features?.includes("evm")
  );

  const betaChainList = chainStore.chainInfosInUI.filter(
    (chainInfo) => chainInfo.beta
  );

  return (
    <div className={style["chainListContainer"]}>
      {evmChainList.length > 0 ? (
        <div className={style["chain-title"]}>EVM</div>
      ) : null}
      {evmChainList.map((chainInfo) => (
        <Card
          leftImage={
            chainInfo.chainName ? chainInfo.chainName[0].toUpperCase() : ""
          }
          heading={chainInfo.chainName}
          isActive={chainInfo.chainId === chainStore.current.chainId}
          rightContent={
            chainInfo.chainId === chainStore.current.chainId
              ? require("@assets/svg/wireframe/check.svg")
              : ""
          }
          onClick={() => {
            let properties = {};
            if (chainInfo.chainId !== chainStore.current.chainId) {
              properties = {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
                toChainId: chainInfo.chainId,
                toChainName: chainInfo.chainName,
              };
            }
            chainStore.selectChain(chainInfo.chainId);
            chainStore.saveLastViewChainId();
            store.dispatch(resetUser({}));
            store.dispatch(resetProposals({}));

            store.dispatch(resetChatList({}));
            store.dispatch(setIsChatSubscriptionActive(false));
            messageAndGroupListenerUnsubscribe();
            navigate("/");
            if (Object.values(properties).length > 0) {
              analyticsStore.logEvent("Chain changed", properties);
            }
          }}
        />
      ))}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navigate("/setting/addEvmChain");
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ButtonGradient
          onClick={undefined}
          gradientText={"+"}
          text={"Add custom EVM network"}
        />
      </a>
      <div className={style["chain-title"]}>COSMOS</div>
      {mainChainList.map((chainInfo) => (
        <Card
          leftImage={
            chainInfo.chainName ? chainInfo.chainName[0].toUpperCase() : ""
          }
          heading={chainInfo.chainName}
          isActive={chainInfo.chainId === chainStore.current.chainId}
          rightContent={
            chainInfo.chainId === chainStore.current.chainId
              ? require("@assets/svg/wireframe/check.svg")
              : ""
          }
          onClick={() => {
            let properties = {};
            if (chainInfo.chainId !== chainStore.current.chainId) {
              properties = {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
                toChainId: chainInfo.chainId,
                toChainName: chainInfo.chainName,
              };
            }
            chainStore.selectChain(chainInfo.chainId);
            chainStore.saveLastViewChainId();
            store.dispatch(resetUser({}));
            store.dispatch(resetProposals({}));

            store.dispatch(resetChatList({}));
            store.dispatch(setIsChatSubscriptionActive(false));
            messageAndGroupListenerUnsubscribe();
            navigate("/");
            if (Object.values(properties).length > 0) {
              analyticsStore.logEvent("Chain changed", properties);
            }
          }}
        />
      ))}
      <div className={style["chain-title"]}>
        {betaChainList.length > 0 ? "Beta support" : null}
      </div>

      {betaChainList.map((chainInfo) => (
        <Card
          leftImage={
            chainInfo.chainName ? chainInfo.chainName[0].toUpperCase() : ""
          }
          heading={chainInfo.chainName}
          isActive={chainInfo.chainId === chainStore.current.chainId}
          rightContent={
            chainInfo.chainId === chainStore.current.chainId
              ? require("@assets/svg/wireframe/check.svg")
              : ""
          }
          onClick={() => {
            let properties = {};
            if (chainInfo.chainId !== chainStore.current.chainId) {
              properties = {
                chainId: chainStore.current.chainId,
                chainName: chainStore.current.chainName,
                toChainId: chainInfo.chainId,
                toChainName: chainInfo.chainName,
              };
            }
            chainStore.selectChain(chainInfo.chainId);
            chainStore.saveLastViewChainId();
            store.dispatch(resetUser({}));
            store.dispatch(resetProposals({}));

            store.dispatch(resetChatList({}));
            store.dispatch(setIsChatSubscriptionActive(false));
            messageAndGroupListenerUnsubscribe();
            navigate("/");
            if (Object.values(properties).length > 0) {
              analyticsStore.logEvent("Chain changed", properties);
            }
          }}
        />
      ))}

      <a
        href="https://chains.keplr.app/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "none" }}
      >
        <div className={classnames(style["chainName"], style["addChain"])}>
          <div>{intl.formatMessage({ id: "main.suggest.chain.link" })}</div>
        </div>
      </a>
    </div>
  );
});
