import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "reactstrap";

import style from "./style.module.scss";
import { EmptyLayout } from "@layouts/empty-layout";
import { FormattedMessage } from "react-intl";
import { useAddressBookConfig, useInteractionInfo } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { useStore } from "../../stores";
import { ExtensionKVStore } from "@keplr-wallet/common";

export const ApproveAddEntry: FunctionComponent = observer(() => {
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
    addressBookStore.rejectAllAddEntry();
  });

  useEffect(() => {
    if (addressBookStore.waitingSuggestedEntryToAdd) {
      // TODO: update event properties
      // analyticsStore.logEvent("AddressBook listed", {
      //   // TODO change event params
      //   chainId: addressBookStore.waitingSuggestedEntryToAdd.data.entry,
      // });
    }
  }, [analyticsStore, addressBookStore.waitingSuggestedEntryToAdd]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingPlaceholder(false);
    }, 1000);
  }, []);

  if (!addressBookStore.waitingSuggestedEntryToAdd) {
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
                <FormattedMessage id="addressBook.add.title" />
              </h1>

              <div className={style["paragraph"]}>
                <FormattedMessage
                  id="addressBook.add.paragraph"
                  values={{
                    host: addressBookStore.waitingSuggestedEntryToAdd?.data
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
              disabled={!addressBookStore.waitingSuggestedEntryToAdd}
              data-loading={addressBookStore.isLoading}
              onClick={async (e) => {
                e.preventDefault();

                addressBookStore.rejectAddEntry();

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
              disabled={!addressBookStore.waitingSuggestedEntryToAdd}
              data-loading={addressBookStore.isLoading}
              onClick={async (e) => {
                e.preventDefault();

                const entry =
                  addressBookStore.waitingSuggestedEntryToAdd?.data.entry;

                if (entry) {
                  console.log(entry);
                  await addressBookStore.approveAddEntry(entry);
                  await addressBookConfig.loadAddressBookDatas();
                  const addressIndex =
                    addressBookConfig.addressBookDatas.findIndex(
                      (element) => element.address === entry.address
                    );
                  if (addressIndex < 0) {
                    await addressBookConfig.addAddressBook(entry);
                  } else {
                    throw new Error("Address already exist");
                  }
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
