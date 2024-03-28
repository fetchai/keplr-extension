import { Card } from "@components-v2/card";
import { useConfirm } from "@components/confirm";
import { ExtensionKVStore } from "@keplr-wallet/common";
import { Bech32Address } from "@keplr-wallet/cosmos";
import {
  AddressBookSelectHandler,
  useAddressBookConfig,
} from "@keplr-wallet/hooks";
import { shortenAgentAddress } from "@utils/validate-agent";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { useIntl } from "react-intl";
import { useStore } from "../../../stores";

export const AddressRow: FunctionComponent<{
  data: any;
  i: number;
  setAddAddressModalIndex: any;
  setAddAddressModalOpen: any;
  selectedChainId: any;
  onBackButton?: () => void;
  selectHandler?: AddressBookSelectHandler;
}> = observer(
  ({
    onBackButton,
    selectHandler,
    data,
    i,
    setAddAddressModalIndex,
    setAddAddressModalOpen,
    selectedChainId,
  }) => {
    const intl = useIntl();
    const { chainStore, analyticsStore } = useStore();
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

    const confirm = useConfirm();

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
  }
);
