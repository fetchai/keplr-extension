import React, { FunctionComponent, useEffect, useState } from "react";
import { HeaderLayout } from "@layouts/index";
import { AddressInput, Input, MemoInput } from "@components/form";
import { Button } from "reactstrap";
import { FormattedMessage, useIntl } from "react-intl";
import { observer } from "mobx-react-lite";
import {
  AddressBookConfig,
  MemoConfig,
  RecipientConfig,
} from "@keplr-wallet/hooks";
import { useLocation } from "react-router";
import { chatSectionParams, defaultParamValues } from "./index";
import { useNotification } from "@components/notification";

/**
 *
 * @param closeModal
 * @param addAddressBook
 * @param chainInfo
 * @param index If index is lesser than 0, it is considered as adding address book. If index is equal or greater than 0, it is considered as editing address book.
 * @param addressBookKVStore
 * @constructor
 */
export const AddAddressModal: FunctionComponent<{
  closeModal: () => void;
  recipientConfig: RecipientConfig;
  memoConfig: MemoConfig;
  addressBookConfig: AddressBookConfig;
  index: number;
  chainId: string;
}> = observer(
  ({ closeModal, recipientConfig, memoConfig, addressBookConfig, index }) => {
    const intl = useIntl();

    const [name, setName] = useState("");
    const location = useLocation();
    const notification = useNotification();

    const chatSectionParams =
      (location.state as chatSectionParams) || defaultParamValues;
    useEffect(() => {
      if (index >= 0) {
        const data = addressBookConfig.addressBookDatas[index];
        setName(data.name);
        recipientConfig.setRawRecipient(data.address);
        memoConfig.setMemo(data.memo);
      }
    }, [
      addressBookConfig.addressBookDatas,
      index,
      memoConfig,
      recipientConfig,
    ]);

    return (
      <HeaderLayout
        showChainName={false}
        canChangeChainInfo={false}
        alternativeTitle={
          index >= 0
            ? intl.formatMessage({
                id: "setting.address-book.edit-address.title",
              })
            : intl.formatMessage({
                id: "setting.address-book.add-address.title",
              })
        }
        onBackButton={() => {
          // Clear the recipient and memo before closing
          recipientConfig.setRawRecipient("");
          memoConfig.setMemo("");
          closeModal();
        }}
      >
        <form
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Input
            type="text"
            label={intl.formatMessage({ id: "setting.address-book.name" })}
            autoComplete="off"
            value={name}
            onChange={(e) => {
              setName(e.target.value.substring(0, 30));
            }}
          />
          <AddressInput
            recipientConfig={recipientConfig}
            label={intl.formatMessage({ id: "setting.address-book.address" })}
            disableAddressBook={true}
            value={chatSectionParams.addressInputValue}
          />
          <MemoInput
            memoConfig={memoConfig}
            label={intl.formatMessage({ id: "setting.address-book.memo" })}
          />
          <div style={{ flex: 1 }} />
          <Button
            type="submit"
            color="primary"
            disabled={
              !name ||
              name.trim() === "" ||
              recipientConfig.getError() != null ||
              memoConfig.getError() != null
            }
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!recipientConfig.recipient) {
                throw new Error("Invalid address");
              }

              const addressAvailableList = addressBookConfig.addressBookDatas.filter(
                (element) => element.address === recipientConfig.recipient
              );
              if (index < 0 && addressAvailableList.length === 0) {
                addressBookConfig.addAddressBook({
                  name: name.trim(),
                  address: recipientConfig.recipient,
                  memo: memoConfig.memo,
                });
              } else if (index > 0 && addressAvailableList.length > 1) {
                addressBookConfig.editAddressBookAt(index, {
                  name: name.trim(),
                  address: recipientConfig.recipient,
                  memo: memoConfig.memo,
                });
              } else {
                notification.push({
                  placement: "top-center",
                  type: "warning",
                  duration: 2,
                  content: intl.formatMessage({
                    id: "main.menu.address-available",
                  }),
                  canDelete: true,
                  transition: {
                    duration: 0.25,
                  },
                });
                return;
              }

              // Clear the recipient and memo before closing
              recipientConfig.setRawRecipient("");
              memoConfig.setMemo("");
              closeModal();
            }}
          >
            <FormattedMessage id={"setting.address-book.button.save"} />
          </Button>
        </form>
      </HeaderLayout>
    );
  }
);
