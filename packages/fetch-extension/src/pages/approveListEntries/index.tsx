import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";

import style from "./style.module.scss";
import { EmptyLayout } from "@layouts/empty-layout";
import { FormattedMessage } from "react-intl";
import {
  AddressBookData,
  useAddressBookConfig,
  useInteractionInfo,
} from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
// import { ToolTip } from "@components/tooltip";
import classNames from "classnames";
// import { GithubIcon, InformationCircleOutline } from "@components/icon";
import { useStore } from "../../stores";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { SyncAddressBookDataMsg } from "@keplr-wallet/background";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";

export const ApproveListEntries: FunctionComponent = observer(() => {
  const { addressBookStore, analyticsStore, chainStore } = useStore();
  const [isLoadingPlaceholder, setIsLoadingPlaceholder] = useState(true);
  const navigate = useNavigate();

  const chainId = chainStore.current.chainId;
  if (!chainId) {
    throw Error("Chain Id not found");
  }
  const addressBookConfig = useAddressBookConfig(
    new ExtensionKVStore("address-book"),
    chainStore,
    chainId,
    {
      setRecipient: (): void => {
        // noop
      },
      setMemo: (): void => {
        // noop
      },
    }
  );
  const interactionInfo = useInteractionInfo(() => {
    addressBookStore.rejectAllListEntries();
  });

  useEffect(() => {
    if (addressBookStore.waitingSuggestedChainIdToList) {
      analyticsStore.logEvent("AddressBook listed", {
        // TODO change event params
        chainId: addressBookStore.waitingSuggestedChainIdToList.data.chainId,
      });
    }
  }, [analyticsStore, addressBookStore.waitingSuggestedChainIdToList]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPlaceholder(false);
    }, 1000);
  }, []);

  if (!addressBookStore.waitingSuggestedChainIdToList) {
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
          {
            <div className={style["content"]}>
              <div className={style["logo"]}>
                <div className={style["imageContainer"]}>
                  <div className={style["imageBackground"]} />
                  <img
                    className={style["logoImage"]}
                    src={require("@assets/logo-256.svg")}
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
                    src={require("../../public/assets/logo-256.svg")}
                    alt="keplr logo"
                  />
                </div>
              </div>
              <h1 className={style["header"]}>
                <FormattedMessage id="addressBook.list.title" />
              </h1>

              <div className={style["paragraph"]}>
                <FormattedMessage
                  id="addressBook.list.paragraph"
                  values={{
                    host: addressBookStore.waitingSuggestedChainIdToList?.data
                      .origin,
                    b: (...chunks: any) => <b>{chunks}</b>,
                  }}
                />
              </div>
            </div>
          }
          <div className={style["buttons"]}>
            <Button
              className={style["button"]}
              color="danger"
              outline
              disabled={!addressBookStore.waitingSuggestedChainIdToList}
              data-loading={addressBookStore.isLoading}
              onClick={async (e) => {
                e.preventDefault();

                addressBookStore.rejectListEntries();

                if (
                  interactionInfo.interaction &&
                  !interactionInfo.interactionInternal
                ) {
                  window.close();
                } else {
                  navigate("/");
                }
              }}
            >
              <FormattedMessage id="chain.suggested.button.reject" />
            </Button>
            <Button
              className={style["button"]}
              color="primary"
              disabled={!addressBookStore.waitingSuggestedChainIdToList}
              data-loading={addressBookStore.isLoading}
              onClick={async (e) => {
                e.preventDefault();

                const chainId =
                  addressBookStore.waitingSuggestedChainIdToList?.data.chainId;

                if (chainId) {
                  addressBookConfig.loadAddressBookDatas();
                  const addresses = addressBookConfig.addressBookDatas;
                  const addressList: AddressBookData[] = [];
                  for (let i = 0; i < addresses.length; i++) {
                    addressList.push({
                      address: addresses[i].address,
                      name: addresses[i].name,
                      memo: addresses[i].memo,
                    });
                  }
                  const msg = new SyncAddressBookDataMsg(addressList);
                  const requester = new InExtensionMessageRequester();
                  await requester.sendMessage(BACKGROUND_PORT, msg);
                  addressBookStore.approveListEntries(chainId);
                }

                if (
                  interactionInfo.interaction &&
                  !interactionInfo.interactionInternal
                ) {
                  window.close();
                } else {
                  navigate("/");
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
