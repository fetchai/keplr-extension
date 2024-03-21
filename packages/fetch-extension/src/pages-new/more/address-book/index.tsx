import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useIntl } from "react-intl";
import { useNavigate, useLocation } from "react-router";
import style from "../style.module.scss";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
} from "reactstrap";
import styleAddressBook from "./style.module.scss";
import { useStore } from "../../../stores";
import { AddAddressModal } from "./add-address-modal";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { Bech32Address } from "@keplr-wallet/cosmos";
import { useConfirm } from "@components/confirm";
import {
  AddressBookSelectHandler,
  IIBCChannelConfig,
  useAddressBookConfig,
  useMemoConfig,
  useRecipientConfig,
} from "@keplr-wallet/hooks";
import { shortenAgentAddress } from "@utils/validate-agent";
import { HeaderLayout } from "@layouts-v2/header-layout";
import { Dropdown } from "@components-v2/dropdown";
import styles from "../token/manage/style.module.scss";
import { Card } from "@components-v2/card";

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
    const { chainStore, uiConfigStore, analyticsStore } = useStore();
    const current = chainStore.current;
    const location = useLocation();
    const chatSectionParams =
      (location.state as chatSectionParams) || defaultParamValues;
    const [selectedChainId, setSelectedChainId] = useState(
      ibcChannelConfig?.channel
        ? ibcChannelConfig.channel.counterpartyChainId
        : current.chainId
    );

    const recipientConfig = useRecipientConfig(chainStore, selectedChainId, {
      allowHexAddressOnEthermint: true,
      icns: uiConfigStore.icnsInfo,
    });
    const memoConfig = useMemoConfig(chainStore, selectedChainId);

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

    const [dropdownOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!dropdownOpen);

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

    const confirm = useConfirm();
    const closeModal = () => {
      if (chatSectionParams.openModal) {
        navigate(-1);
      }
      setAddAddressModalOpen(false);
      setAddAddressModalIndex(-1);
    };
    const addressBookIcons = (index: number) => {
      return [
        <i
          key="edit"
          className="fas fa-pen"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            analyticsStore.logEvent("edit_address_book_click");
            setAddAddressModalOpen(true);
            setAddAddressModalIndex(index);
          }}
        />,
        <i
          key="remove"
          className="fas fa-trash"
          style={{ cursor: "pointer" }}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            analyticsStore.logEvent("delete_address_book_click", {
              action: "No",
            });

            if (
              await confirm.confirm({
                img: (
                  <img
                    alt=""
                    src={require("@assets/img/trash.svg")}
                    style={{ height: "80px" }}
                  />
                ),
                title: intl.formatMessage({
                  id: "setting.address-book.confirm.delete-address.title",
                }),
                paragraph: intl.formatMessage({
                  id: "setting.address-book.confirm.delete-address.paragraph",
                }),
              })
            ) {
              analyticsStore.logEvent("delete_address_book_click", {
                action: "Yes",
              });
              setAddAddressModalOpen(false);
              setAddAddressModalIndex(-1);
              addressBookConfig.removeAddressBook(index);
            }
          }}
        />,
      ];
    };

    const handleAddressClick = (
      e: React.MouseEvent<HTMLDivElement>,
      address: string,
      i: number
    ) => {
      e.preventDefault();
      e.stopPropagation();
      if (!address.startsWith("agent")) {
        addressBookConfig.selectAddressAt(i);

        if (onBackButton) {
          onBackButton();
        }
      }
    };

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
        <Modal
          isOpen={addAddressModalOpen}
          backdrop={false}
          className={styleAddressBook["fullModal"]}
          wrapClassName={styleAddressBook["fullModal"]}
          contentClassName={styleAddressBook["fullModal"]}
        >
          <ModalBody className={styleAddressBook["fullModal"]}>
            <AddAddressModal
              closeModal={() => closeModal()}
              recipientConfig={recipientConfig}
              memoConfig={memoConfig}
              addressBookConfig={addressBookConfig}
              index={addAddressModalIndex}
              chainId={selectedChainId}
            />
          </ModalBody>
        </Modal>
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
                    dsaf
                    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle caret style={{ boxShadow: "none" }}>
                        {chainStore.getChain(selectedChainId).chainName}
                      </DropdownToggle>

                      <DropdownMenu>
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
                      </DropdownMenu>
                    </ButtonDropdown>
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
              {addressBookConfig.addressBookDatas.map((data, i) => {
                return (
                  <Card
                    key={i.toString()}
                    heading={data.name}
                    subheading={
                      <div>
                        {data.address.indexOf(
                          chainStore.getChain(selectedChainId).bech32Config
                            .bech32PrefixAccAddr
                        ) === 0
                          ? Bech32Address.shortenAddress(data.address, 34)
                          : data.address.startsWith("agent")
                          ? shortenAgentAddress(data.address)
                          : data.address}
                        <div>{data.memo}</div>
                      </div>
                    }
                    rightContent={
                      <div style={{ display: "flex", gap: "5px" }}>
                        {addressBookIcons(i)}
                      </div>
                    }
                    data-index={i}
                    // disabled={onBackButton && data.address.startsWith("agent")}
                    onClick={(e: any) =>
                      !onBackButton &&
                      !data.address.startsWith("agent") &&
                      handleAddressClick(e, data.address, i)
                    }
                    style={{
                      cursor: selectHandler ? undefined : "auto",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </HeaderLayout>
    );
  }
);
