import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";

import style from "./style.module.scss";
import { EmptyLayout } from "@layouts/empty-layout";
import { FormattedMessage } from "react-intl";
import { useInteractionInfo } from "@hooks/interaction";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { ToolTip } from "@components/tooltip";
import classNames from "classnames";
import { GithubIcon, InformationCircleOutline } from "@components/icon";
import { InteractionWaitingData } from "@keplr-wallet/background";
import { ChainInfo } from "@keplr-wallet/types";

export const ChainSuggestedPage: FunctionComponent = observer(() => {
  const { chainSuggestStore } = useStore();

  useInteractionInfo(async () => {
    await chainSuggestStore.rejectAll();
  });

  const waitingData = chainSuggestStore.waitingSuggestedChainInfo;

  if (!waitingData) {
    return null;
  }
  // waiting data가 변하면 `SuggestChainPageImpl`가 unmount되고 다시 mount되는데,
  // 이때, `SuggestChainPageImpl`의 key가 바뀌면서, `SuggestChainPageImpl`의 state가 초기화된다.
  return (
    <ChainSuggestedPageImpl key={waitingData.id} waitingData={waitingData} />
  );
});

export const ChainSuggestedPageImpl: FunctionComponent<{
  waitingData: InteractionWaitingData<{
    chainInfo: ChainInfo;
    origin: string;
  }>;
}> = observer(({ waitingData }) => {
  const { chainSuggestStore, analyticsStore, uiConfigStore } = useStore();
  const [updateFromRepoDisabled, setUpdateFromRepoDisabled] = useState(false);
  const [isLoadingPlaceholder, setIsLoadingPlaceholder] = useState(true);
  const navigate = useNavigate();

  const interactionInfo = useInteractionInfo(async () => {
    await chainSuggestStore.rejectAll();
  });

  const queryCommunityChainInfo = chainSuggestStore.getCommunityChainInfo(
    waitingData.data.chainInfo.chainId
  );
  const communityChainInfo = queryCommunityChainInfo.chainInfo;

  useEffect(() => {
    if (chainSuggestStore.waitingSuggestedChainInfo) {
      analyticsStore.logEvent("Chain suggested", {
        chainId:
          chainSuggestStore.waitingSuggestedChainInfo.data.chainInfo.chainId,
        chainName:
          chainSuggestStore.waitingSuggestedChainInfo.data.chainInfo.chainName,
        rpc: chainSuggestStore.waitingSuggestedChainInfo.data.chainInfo.rpc,
        rest: chainSuggestStore.waitingSuggestedChainInfo.data.chainInfo.rest,
      });
    }
  }, [analyticsStore, chainSuggestStore.waitingSuggestedChainInfo]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPlaceholder(false);
    }, 1000);
  }, []);

  if (!chainSuggestStore.waitingSuggestedChainInfo) {
    return null;
  }

  return (
    <EmptyLayout style={{ height: "100%" }}>
      {isLoadingPlaceholder ? (
        <div className={style["container"]}>
          <div className={style["content"]}>
            <div className={style["logo"]}>
              <div className={style["imageContainer"]}>
                <div
                  className={classNames(
                    style["skeleton"],
                    style["skeletonImageBackground"]
                  )}
                />
              </div>
              <div className={style["dots"]}>
                <div
                  className={classNames(
                    style["skeletonDot"],
                    style["skeleton"]
                  )}
                />
                <div
                  className={classNames(
                    style["skeletonDot"],
                    style["skeleton"]
                  )}
                />
                <div
                  className={classNames(
                    style["skeletonDot"],
                    style["skeleton"]
                  )}
                />
              </div>
              <div className={style["imageContainer"]}>
                <div
                  className={classNames(
                    style["skeleton"],
                    style["skeletonImageBackground"]
                  )}
                />
              </div>
            </div>

            <h1 className={style["header"]}>Connecting...</h1>

            <div className={style["skeletonTag"]}>
              <div
                className={classNames(
                  style["skeleton"],
                  style["skeletonGithubLink"]
                )}
              />
            </div>

            <div className={classNames(style["skeletonParagraph"])}>
              <div
                className={classNames(
                  style["skeleton"],
                  style["skeletonTitle"]
                )}
              />
              <div
                className={classNames(
                  style["skeleton"],
                  style["skeletonContent"]
                )}
              />
            </div>

            <div className={style["buttons"]}>
              <div
                className={classNames(
                  style["button"],
                  style["skeleton"],
                  style["skeletonButton"]
                )}
              />
              <div
                className={classNames(
                  style["button"],
                  style["skeleton"],
                  style["skeletonButton"]
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={style["container"]}>
          {updateFromRepoDisabled || !communityChainInfo ? (
            <div className={style["content"]}>
              {communityChainInfo && (
                <img
                  className={style["backButton"]}
                  src={require("@assets/svg/arrow-left.svg")}
                  onClick={() => {
                    setUpdateFromRepoDisabled(false);
                  }}
                />
              )}
              <h1 className={style["header"]}>
                <FormattedMessage
                  id="chain.suggested.title"
                  values={{
                    chainName:
                      chainSuggestStore.waitingSuggestedChainInfo?.data
                        .chainInfo.chainName,
                  }}
                />
              </h1>
              <div className={style["origin"]}>
                <ToolTip
                  tooltip={
                    <div className={style["tooltip"]}>
                      <FormattedMessage id="chain.suggested.tooltip" />
                    </div>
                  }
                  trigger="hover"
                >
                  <div className={style["text"]}>
                    {chainSuggestStore.waitingSuggestedChainInfo?.data.origin}
                  </div>
                </ToolTip>
              </div>
              <div className={style["chainContainer"]}>
                <div className={style["chainInfoContainer"]}>
                  <pre className={style["chainInfo"]}>
                    {JSON.stringify(
                      chainSuggestStore.waitingSuggestedChainInfo.data
                        .chainInfo,
                      undefined,
                      2
                    )}
                  </pre>
                </div>

                {uiConfigStore.isDeveloper &&
                  !communityChainInfo && (
                    <div
                      className={classNames(
                        style["developerInfo"],
                        "custom-control custom-checkbox"
                      )}
                    >
                      <input
                        className="custom-control-input"
                        id="use-community-checkbox"
                        type="checkbox"
                        checked={updateFromRepoDisabled}
                        onChange={(e) => {
                          setUpdateFromRepoDisabled(e.target.checked);
                        }}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="use-community-checkbox"
                        style={{ color: "#323C4A", paddingTop: "1px" }}
                      >
                        <FormattedMessage id="chain.suggested.developer.checkbox" />
                      </label>
                    </div>
                  )}

                <div
                  className={classNames(
                    style["approveInfoContainer"],
                    !communityChainInfo
                      ? style["info"]
                      : style["alert"]
                  )}
                >
                  <div className={style["titleContainer"]}>
                    <InformationCircleOutline
                      fill={
                        !communityChainInfo ? "#566172" : "#F0224B"
                      }
                    />
                    <div className={style["text"]}>
                      <FormattedMessage id="chain.suggested.approve-info.title" />
                    </div>
                  </div>
                  <div className={style["content"]}>
                    {!communityChainInfo ? (
                      <FormattedMessage id="chain.suggested.approve-info.content" />
                    ) : (
                      <FormattedMessage id="chain.suggested.approve-alert.content" />
                    )}
                  </div>
                  {!communityChainInfo && (
                    <div className={style["link"]}>
                      <a
                        href={chainSuggestStore.communityChainInfoRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FormattedMessage id="chain.suggested.approve-info.link" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={style["content"]}>
              <div className={style["logo"]}>
                <div className={style["imageContainer"]}>
                  <div className={style["imageBackground"]} />
                  <img
                    className={style["logoImage"]}
                    src={
                      communityChainInfo?.chainSymbolImageUrl ||
                      require("@assets/logo-256.svg")
                    }
                    alt="chain logo"
                  />
                </div>
                <div className={style["dots"]}>
                  <div className={style["dot"]} />
                  <div className={style["dot"]} />
                  <div className={style["dot"]} />
                </div>
                <div className={style["imageContainer"]}>
                  <div className={style["imageBackground"]} />
                  <img
                    className={style["logoImage"]}
                    src={require("../../../public/assets/logo-256.svg")}
                    alt="keplr logo"
                  />
                </div>
              </div>
              <h1 className={style["header"]}>
                <FormattedMessage
                  id="chain.suggested.title"
                  values={{
                    chainName:
                      chainSuggestStore.waitingSuggestedChainInfo?.data
                        .chainInfo.chainName,
                  }}
                />
              </h1>

              <ToolTip
                tooltip={
                  <div className={style["tooltip"]}>
                    <FormattedMessage id="chain.suggested.tooltip" />
                  </div>
                }
                trigger="hover"
              >
                <div className={style["tag"]}>
                  <a
                    href={chainSuggestStore.getCommunityChainInfoUrl(
                      chainSuggestStore.waitingSuggestedChainInfo?.data
                        .chainInfo.chainId
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className={style["item"]}>
                      <FormattedMessage id="chain.suggested.community-driven" />
                      <GithubIcon />
                    </div>
                  </a>
                </div>
              </ToolTip>

              <div className={style["paragraph"]}>
                <FormattedMessage
                  id="chain.suggested.paragraph"
                  values={{
                    host: chainSuggestStore.waitingSuggestedChainInfo?.data
                      .origin,
                    chainId:
                      chainSuggestStore.waitingSuggestedChainInfo?.data
                        .chainInfo.chainId,
                    // eslint-disable-next-line react/display-name
                    b: (...chunks: any) => <b>{chunks}</b>,
                  }}
                />
              </div>

              {uiConfigStore.isDeveloper && (
                <div
                  className={style["chainDetailContainer"]}
                  onClick={() => setUpdateFromRepoDisabled(true)}
                >
                  <FormattedMessage id="chain.suggested.add-chain-as-suggested" />
                  <img
                    src={require("../../../public/assets/svg/arrow-right-outline.svg")}
                  />
                </div>
              )}
            </div>
          )}
          <div className={style["buttons"]}>
            <Button
              className={style["button"]}
              color="danger"
              outline
              disabled={!chainSuggestStore.waitingSuggestedChainInfo}
              data-loading={chainSuggestStore.isObsoleteInteraction(waitingData.id)}
              onClick={async (e) => {
                e.preventDefault();

                await chainSuggestStore.rejectWithProceedNext(
                  waitingData.id,
                  (proceedNext) => {
                    if (!proceedNext) {
                      if (
                        interactionInfo.interaction &&
                        !interactionInfo.interactionInternal
                      ) {
                        window.close();
                      }  else {
                        navigate("/");
                      }
                    }  else {
                      navigate("/");
                    }
                  }
                );
              }}
            >
              <FormattedMessage id="chain.suggested.button.reject" />
            </Button>
            <Button
              className={style["button"]}
              color="primary"
              disabled={!chainSuggestStore.waitingSuggestedChainInfo}
              data-loading={chainSuggestStore.isObsoleteInteraction(waitingData.id)}
              onClick={async (e) => {
                e.preventDefault();

                const chainInfo = updateFromRepoDisabled
                  ? chainSuggestStore.waitingSuggestedChainInfo?.data.chainInfo
                  : communityChainInfo ||
                    chainSuggestStore.waitingSuggestedChainInfo?.data.chainInfo;

                function handlingInteraction() {
                  if (
                    interactionInfo.interaction &&
                    !interactionInfo.interactionInternal
                  ) {
                    window.close();
                  } else {
                    navigate("/");
                  }
                }

                if (chainInfo) {
                  await chainSuggestStore.approveWithProceedNext(
                    waitingData.id,
                    {
                      ...chainInfo,
                    },
                    (proceedNext) => {
                      if (!proceedNext) {
                        handlingInteraction();

                      }else {
                        navigate("/");
                      }
                    }
                  );
                } else {
                handlingInteraction();
                }



              }}
            >
              <FormattedMessage id="chain.suggested.button.approve" />
            </Button>
          </div>
        </div>
      )}
    </EmptyLayout>
  );
});
