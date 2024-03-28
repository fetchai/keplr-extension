import { Dropdown } from "@components-v2/dropdown";
import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  AddressBookSelectHandler,
  IIBCChannelConfig,
  useAddressBookConfig,
} from "@keplr-wallet/hooks";
import { HeaderLayout } from "@layouts-v2/header-layout";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router";
import { DropdownItem } from "reactstrap";
import { useStore } from "../../../stores";
import style from "../style.module.scss";
import styles from "../token/manage/style.module.scss";
import { AddAddressModal } from "./add-address-modal";
import { AddressRow } from "./address-row";
import styleAddressBook from "./style.module.scss";

export interface chatSectionParams {
  openModal: boolean;
  addressInputValue: string;
}
export const defaultParamValues: chatSectionParams = {
  openModal: false,
  addressInputValue: "",
};
export const AddressBookPage: FunctionComponent<{
  onBackButton?: () => void;
  hideChainDropdown?: boolean;
  selectHandler?: AddressBookSelectHandler;
  ibcChannelConfig?: IIBCChannelConfig;
}> = observer(
  ({ onBackButton, hideChainDropdown, selectHandler, ibcChannelConfig }) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const { chainStore, analyticsStore } = useStore();
    const current = chainStore.current;
    const location = useLocation();
    const chatSectionParams =
      (location.state as chatSectionParams) || defaultParamValues;
    const [selectedChainId, setSelectedChainId] = useState(
      ibcChannelConfig?.channel
        ? ibcChannelConfig.channel.counterpartyChainId
        : current.chainId
    );
    const addressBookConfig = useAddressBookConfig(
      new ExtensionKVStore("address-book"),
      chainStore,
      selectedChainId,
      selectHandler
        ? selectHandler
        : {
            setRecipient: (): void => {
              // noop
            },
            setMemo: (): void => {
              // noop
            },
          }
    );

    const [addAddressModalOpen, setAddAddressModalOpen] = useState(
      chatSectionParams.openModal || false
    );
    const [addAddressModalIndex, setAddAddressModalIndex] = useState(-1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (chatSectionParams.openModal) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
      }
    }, [chatSectionParams.openModal]);

    const [isOpen, setIsOpen] = useState(false);

    return (
      <HeaderLayout
        showTopMenu={true}
        smallTitle={true}
        showChainName={false}
        canChangeChainInfo={false}
        alternativeTitle={intl.formatMessage({
          id: "main.menu.address-book",
        })}
        onBackButton={
          onBackButton
            ? onBackButton
            : () => {
                analyticsStore.logEvent("back_click", {
                  pageName: "Address Book Page",
                });
                navigate(-1);
              }
        }
        rightRenderer={
          <button
            className={styles["plusIcon"]}
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              analyticsStore.logEvent("add_new_address_click", {
                pageName: "Drawer",
              });
              setAddAddressModalOpen(true);
            }}
          >
            +
          </button>
        }
      >
        <AddAddressModal
          chainId={selectedChainId}
          selectHandler={selectHandler}
          addAddressModalOpen={addAddressModalOpen}
          setAddAddressModalOpen={setAddAddressModalOpen}
          addAddressModalIndex={addAddressModalIndex}
          setAddAddressModalIndex={setAddAddressModalIndex}
        />
        {loading ? (
          <div className={styleAddressBook["loader"]}>Loading ....</div>
        ) : (
          <div className={style["container"]}>
            <div className={styleAddressBook["innerTopContainer"]}>
              {hideChainDropdown ? null : (
                <div>
                  <Dropdown
                    title={""}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    closeClicked={() => setIsOpen(!isOpen)}
                  >
                    <div className={styleAddressBook["dropdownWrapper"]}>
                      {chainStore.chainInfos.map((chainInfo) => {
                        return (
                          <DropdownItem
                            key={chainInfo.chainId}
                            onClick={() => {
                              setSelectedChainId(chainInfo.chainId);
                            }}
                          >
                            {chainInfo.chainName}
                          </DropdownItem>
                        );
                      })}
                    </div>
                  </Dropdown>
                </div>
              )}
              <div style={{ flex: 1 }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              />
            </div>
            <div style={{ flex: "1 1 0", overflowY: "auto" }}>
              {addressBookConfig.addressBookDatas.map((data, i) => (
                <AddressRow
                  key={i.toString()}
                  data={data}
                  i={i}
                  onBackButton={onBackButton}
                  setAddAddressModalIndex={setAddAddressModalIndex}
                  setAddAddressModalOpen={setAddAddressModalOpen}
                  selectedChainId={selectedChainId}
                  selectHandler={selectHandler}
                />
              ))}
            </div>
          </div>
        )}
      </HeaderLayout>
    );
  }
);
