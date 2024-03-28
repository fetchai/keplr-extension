import { ExtensionKVStore } from "@keplr-wallet/common";
import {
  AddressBookSelectHandler,
  useAddressBookConfig,
  useMemoConfig,
  useRecipientConfig,
} from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Modal, ModalBody } from "reactstrap";
import { useStore } from "../../../../stores";
import { AddAddress } from "./add-address";
import styleAddressBook from "./style.module.scss";

export interface chatSectionParams {
  openModal: boolean;
  addressInputValue: string;
}
export const defaultParamValues: chatSectionParams = {
  openModal: false,
  addressInputValue: "",
};
export const AddAddressModal: FunctionComponent<{
  chainId: string;
  selectHandler?: AddressBookSelectHandler;
  addAddressModalOpen: boolean;
  setAddAddressModalOpen: any;
  addAddressModalIndex: number;
  setAddAddressModalIndex: any;
}> = observer(
  ({
    chainId,
    selectHandler,
    addAddressModalOpen,
    setAddAddressModalOpen,
    addAddressModalIndex,
    setAddAddressModalIndex,
  }) => {
    const navigate = useNavigate();
    const { chainStore, uiConfigStore } = useStore();
    const location = useLocation();
    const chatSectionParams =
      (location.state as chatSectionParams) || defaultParamValues;

    const recipientConfig = useRecipientConfig(chainStore, chainId, {
      allowHexAddressOnEthermint: true,
      icns: uiConfigStore.icnsInfo,
    });
    const memoConfig = useMemoConfig(chainStore, chainId);

    const addressBookConfig = useAddressBookConfig(
      new ExtensionKVStore("address-book"),
      chainStore,
      chainId,
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

    const closeModal = () => {
      if (chatSectionParams.openModal) {
        navigate(-1);
      }
      setAddAddressModalOpen(false);
      setAddAddressModalIndex(-1);
    };

    return (
      <Modal
        isOpen={addAddressModalOpen}
        backdrop={false}
        className={styleAddressBook["fullModal"]}
        wrapClassName={styleAddressBook["fullModal"]}
        contentClassName={styleAddressBook["fullModal"]}
      >
        <ModalBody className={styleAddressBook["fullModal"]}>
          <AddAddress
            closeModal={() => closeModal()}
            recipientConfig={recipientConfig}
            memoConfig={memoConfig}
            addressBookConfig={addressBookConfig}
            index={addAddressModalIndex}
            chainId={chainId}
          />
        </ModalBody>
      </Modal>
    );
  }
);
