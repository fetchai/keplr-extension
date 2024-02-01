import React, { FunctionComponent, useEffect, useState } from "react";
import { CardModal } from "modals/card";
import { Text, View, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { IconButton } from "components/new/button/icon";
import { registerModal } from "modals/base";
import { RectButton } from "components/rect-button";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { AddressBookConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { AddressBookIcon, PlusIcon } from "components/icon";
import { XmarkIcon } from "components/new/icon/xmark";
import { TextInput } from "components/input";
import { SearchIcon } from "components/new/icon/search-icon";
import { EmptyView } from "../empty";
import { useStore } from "stores/index";

export const AddressBookCardModel: FunctionComponent<{
  hideCurrentAddress?: boolean;
  isOpen: boolean;
  close: () => void;
  title: string;
  addressBookConfig: AddressBookConfig;
  addAddressBook?: (add: boolean | undefined) => void;
}> = registerModal(
  observer(
    ({
      close,
      title,
      hideCurrentAddress = true,
      isOpen,
      addressBookConfig,
      addAddressBook,
    }) => {
      const style = useStyle();
      const [search, setSearch] = useState("");
      const { chainStore, accountStore } = useStore();
      const account = accountStore.getAccount(chainStore.current.chainId);

      const [filterAddressBook, setFilterAddressBook] = useState(
        addressBookConfig.addressBookDatas
      );

      useEffect(() => {
        const searchTrim = search.trim();
        const newAddressBook = addressBookConfig.addressBookDatas.filter(
          (data) => {
            return (
              data.name.toLowerCase().includes(searchTrim.toLowerCase()) &&
              hideCurrentAddress &&
              !data.address.includes(account.bech32Address)
            );
          }
        );
        setFilterAddressBook(newAddressBook);
      }, [addressBookConfig.addressBookDatas, search]);

      if (!isOpen) {
        return null;
      }

      return (
        <CardModal
          title={title}
          disableGesture={true}
          right={
            <IconButton
              icon={<XmarkIcon />}
              backgroundBlur={true}
              blurIntensity={20}
              borderRadius={50}
              onPress={() => {
                setSearch("");
                close();
              }}
              iconStyle={style.flatten(["padding-12"]) as ViewStyle}
            />
          }
        >
          <BlurBackground borderRadius={12} blurIntensity={20}>
            <TextInput
              placeholder="Search"
              placeholderTextColor={"white"}
              style={style.flatten(["h6"])}
              inputContainerStyle={
                style.flatten([
                  "border-width-0",
                  "padding-x-18",
                  "padding-y-12",
                ]) as ViewStyle
              }
              onChangeText={(text) => {
                setSearch(text);
              }}
              containerStyle={style.flatten(["padding-0"]) as ViewStyle}
              inputRight={<SearchIcon />}
            />
          </BlurBackground>
          <BlurBackground
            borderRadius={12}
            blurIntensity={15}
            containerStyle={style.flatten(["margin-top-24"]) as ViewStyle}
          >
            <RectButton
              style={style.flatten(["border-radius-12"]) as ViewStyle}
              activeOpacity={0.5}
              underlayColor={style.flatten(["color-gray-50"]).color}
              onPress={() => {
                if (addAddressBook) {
                  addAddressBook(true);
                }
                close();
              }}
            >
              <View
                style={
                  style.flatten([
                    "flex-row",
                    "items-center",
                    "padding-18",
                  ]) as ViewStyle
                }
              >
                <IconButton
                  backgroundBlur={false}
                  icon={<PlusIcon color={"white"} size={13} />}
                  iconStyle={style.flatten(["padding-0"]) as ViewStyle}
                />
                <Text
                  style={
                    style.flatten([
                      "body2",
                      "color-white",
                      "margin-left-18",
                    ]) as ViewStyle
                  }
                >
                  Add new address book
                </Text>
              </View>
            </RectButton>
          </BlurBackground>
          {filterAddressBook.length > 0 ? (
            <View style={style.flatten(["margin-y-24"]) as ViewStyle}>
              {filterAddressBook.map((data, i) => {
                return (
                  <RectButton
                    key={i.toString()}
                    onPress={() => {
                      addressBookConfig.selectAddressAt(i);
                      setSearch("");
                      close();
                    }}
                    activeOpacity={0.5}
                    style={
                      style.flatten([
                        "padding-16",
                        "border-radius-12",
                      ]) as ViewStyle
                    }
                    underlayColor={style.flatten(["color-gray-50"]).color}
                  >
                    <Text
                      style={
                        style.flatten([
                          "body2",
                          "color-white",
                          "padding-bottom-10",
                        ]) as ViewStyle
                      }
                    >
                      {data.name}
                    </Text>
                    <Text style={style.flatten(["color-white"]) as ViewStyle}>
                      {data.address}
                    </Text>
                  </RectButton>
                );
              })}
            </View>
          ) : addressBookConfig.addressBookDatas.length == 0 ? (
            <EmptyView
              text="Address book is empty"
              icon={
                <AddressBookIcon
                  color={style.flatten(["color-platinum-100"]).color}
                  height={56}
                />
              }
              containerStyle={
                style.flatten(["relative", "height-214"]) as ViewStyle
              }
            />
          ) : (
            <EmptyView
              containerStyle={
                style.flatten(["relative", "height-214"]) as ViewStyle
              }
            />
          )}
        </CardModal>
      );
    }
  ),
  {
    disableSafeArea: true,
    // disableClosingOnBackdropPress: true,
  }
);
