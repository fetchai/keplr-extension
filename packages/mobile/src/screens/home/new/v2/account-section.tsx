import React, { FunctionComponent, useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { useStyle } from "styles/index";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { SelectAccountButton } from "components/new/select-account/select-account-button";
import { AddressCopyable } from "components/new/address-copyable";
import {
  DrawerActions,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { MultiKeyStoreInfoWithSelectedElem } from "@keplr-wallet/background";
import { useStore } from "stores/index";
import { IconView } from "components/new/button/icon";
import { WalletCardModel } from "components/new/wallet-card/wallet-card";
import { ChangeWalletCardModel } from "components/new/wallet-card/change-wallet";
import { EditAccountNameModal } from "modals/edit-account-name.tsx";
import { PasswordInputModal } from "modals/password-input/modal";
import { useLoadingScreen } from "providers/loading-screen";
import { BlurButton } from "components/new/button/blur-button";
import { ChevronDownIcon } from "components/new/icon/chevron-down";
import { BarCodeIcon } from "components/new/icon/bar-code";
import { InboxIcon } from "components/new/icon/inbox-icon";
import { TreeDotIcon } from "components/new/icon/tree-dot";
import { separateNumericAndDenom } from "utils/format/format";

export const AccountSection: FunctionComponent<{
  containtStyle?: ViewStyle;
  tokenState: any;
}> = observer(({ containtStyle, tokenState }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const loadingScreen = useLoadingScreen();
  const style = useStyle();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [changeWalletModal, setChangeWalletModal] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKeyStore, setSelectedKeyStore] =
    useState<MultiKeyStoreInfoWithSelectedElem>();
  const {
    chainStore,
    accountStore,
    queriesStore,
    priceStore,
    keyRingStore,
    analyticsStore,
    keychainStore,
  } = useStore();

  const waitingNameData = keyRingStore.waitingNameData?.data;

  const account = accountStore.getAccount(chainStore.current.chainId);
  const queries = queriesStore.get(chainStore.current.chainId);

  const queryStakable = queries.queryBalances.getQueryBech32Address(
    account.bech32Address
  ).stakable;
  const stakable = queryStakable.balance;

  const queryDelegated = queries.cosmos.queryDelegations.getQueryBech32Address(
    account.bech32Address
  );
  const delegated = queryDelegated.total;

  const queryUnbonding =
    queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(
      account.bech32Address
    );
  const unbonding = queryUnbonding.total;

  const stakedSum = delegated.add(unbonding);

  const total = stakable.add(stakedSum);

  const totalPrice = priceStore.calculatePrice(total);

  const { numericPart: totalNumber, denomPart: totalDenom } =
    separateNumericAndDenom(
      total.shrink(true).trim(true).maxDecimals(6).toString()
    );

  const changeInDollarsValue =
    tokenState.type === "positive"
      ? (parseFloat(totalNumber) * tokenState.diff) / 100
      : -(parseFloat(totalNumber) * tokenState.diff) / 100;

  return (
    <React.Fragment>
      <View
        style={
          style.flatten([
            "flex-row",
            "justify-between",
            "margin-x-16",
          ]) as ViewStyle
        }
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <SelectAccountButton
            backgroundBlur={false}
            containerStyle={
              style.flatten([
                "padding-x-12",
                "border-width-1",
                "border-color-gray-300",
              ]) as ViewStyle
            }
            text={chainStore.current.chainName}
            icon={<ChevronDownIcon />}
          />
        </TouchableOpacity>
        <View style={style.flatten(["flex-row"])}>
          <TouchableOpacity activeOpacity={0.6}>
            <IconView
              borderRadius={32}
              img={<BarCodeIcon size={18} />}
              backgroundBlur={false}
              iconStyle={
                style.flatten([
                  "border-width-1",
                  "border-color-gray-300",
                  "padding-x-18",
                  "padding-y-8",
                  "justify-center",
                  "margin-right-12",
                ]) as ViewStyle
              }
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <IconView
              borderRadius={32}
              img={<InboxIcon size={18} />}
              backgroundBlur={false}
              iconStyle={
                style.flatten([
                  "border-width-1",
                  "border-color-gray-300",
                  "padding-x-18",
                  "padding-y-8",
                  "justify-center",
                ]) as ViewStyle
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <BlurBackground
        borderRadius={14}
        blurIntensity={16}
        containerStyle={
          [
            style.flatten([
              "flex-row",
              "justify-between",
              "items-center",
              "margin-x-16",
              "margin-top-18",
              "margin-bottom-12",
              "padding-x-20",
              "padding-y-10",
              "border-width-1",
              "border-color-indigo-200",
            ]),
            containtStyle,
          ] as ViewStyle
        }
      >
        <View
          style={
            style.flatten(["margin-right-6", "margin-bottom-6"]) as ViewStyle
          }
        >
          <Text
            style={
              style.flatten([
                "h6",
                "color-white",
                "margin-right-6",
              ]) as ViewStyle
            }
          >
            {account.name}
          </Text>
          <AddressCopyable address={account.bech32Address} maxCharacters={16} />
        </View>
        <View style={style.flatten(["flex-row"])}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setIsOpenModal(true)}
          >
            <IconView backgroundBlur={false} img={<TreeDotIcon />} />
          </TouchableOpacity>
        </View>
      </BlurBackground>
      <View style={style.flatten(["items-center"]) as ViewStyle}>
        <View style={style.flatten(["flex-row"]) as ViewStyle}>
          <Text style={style.flatten(["h1", "color-white"]) as ViewStyle}>
            {totalNumber}
          </Text>
          <Text style={style.flatten(["h1", "color-gray-400"]) as ViewStyle}>
            {totalDenom}
          </Text>
        </View>
        <View style={style.flatten(["flex-row", "margin-y-4"]) as ViewStyle}>
          <Text style={style.flatten(["color-gray-300", "h7"]) as ViewStyle}>
            {totalPrice &&
              ` ${totalPrice.toString()} ${priceStore.defaultVsCurrency.toUpperCase()}`}
          </Text>
        </View>
        {tokenState ? (
          <View style={style.flatten(["flex-row"]) as ViewStyle}>
            <Text
              style={
                style.flatten(
                  ["color-orange-400", "text-caption2"],
                  [tokenState.type === "positive" && "color-green-500"]
                ) as ViewStyle
              }
            >
              {changeInDollarsValue.toFixed(4)} {totalDenom}(
              {tokenState.type === "positive" ? "+" : "-"}
              {parseFloat(tokenState.diff).toFixed(2)})
            </Text>
            <Text style={style.flatten(["color-gray-300", "h7"]) as ViewStyle}>
              {`  ${tokenState.time}`}
            </Text>
          </View>
        ) : null}
        <BlurButton
          backgroundBlur={false}
          containerStyle={
            style.flatten([
              "padding-x-12",
              "border-width-1",
              "border-color-gray-300",
              "margin-top-20",
              "border-radius-32",
            ]) as ViewStyle
          }
          text={"View portfolio"}
          onPress={() => navigation.navigate("Portfolio")}
        />
      </View>
      <WalletCardModel
        isOpen={isOpenModal}
        title="Manage Wallet"
        close={() => setIsOpenModal(false)}
        onSelectWallet={(option: string) => {
          if (option === "change_wallet") {
            setChangeWalletModal(true);
            setIsOpenModal(false);
          } else if (option === "rename_wallet") {
            keyRingStore.multiKeyStoreInfo.map((keyStore) => {
              if (keyStore.meta?.["name"] === account.name) {
                setSelectedKeyStore(keyStore);
              }
            });
            setIsRenameModalOpen(true);
            setIsOpenModal(false);
          } else if (option === "add_new_wallet") {
            analyticsStore.logEvent("Add additional account started");
            navigation.navigate("Register", {
              screen: "Register.Intro",
            });
          } else {
            setIsDeleteModalOpen(true);
            setIsOpenModal(false);
          }
        }}
      />
      <ChangeWalletCardModel
        isOpen={changeWalletModal}
        title="Change Wallet"
        keyRingStore={keyRingStore}
        close={() => setChangeWalletModal(false)}
        onChangeAccount={async (keyStore) => {
          const index = keyRingStore.multiKeyStoreInfo.indexOf(keyStore);
          if (index >= 0) {
            loadingScreen.setIsLoading(true);
            await keyRingStore.changeKeyRing(index);
            loadingScreen.setIsLoading(false);
          }
        }}
      />
      <EditAccountNameModal
        isOpen={isRenameModalOpen}
        close={() => setIsRenameModalOpen(false)}
        title="Edit Account Name"
        isReadOnly={waitingNameData !== undefined && !waitingNameData?.editable}
        onEnterName={async (name) => {
          try {
            const selectedIndex = keyRingStore.multiKeyStoreInfo.findIndex(
              (keyStore) => keyStore == selectedKeyStore
            );

            await keyRingStore.updateNameKeyRing(selectedIndex, name.trim());
            setSelectedKeyStore(undefined);
            setIsRenameModalOpen(false);
          } catch (e) {
            console.log("Fail to decrypt: " + e.message);
          }
        }}
      />
      <PasswordInputModal
        isOpen={isDeleteModalOpen}
        close={() => setIsDeleteModalOpen(false)}
        title="Remove Account"
        onEnterPassword={async (password) => {
          const index = keyRingStore.multiKeyStoreInfo.findIndex(
            (keyStore) => keyStore.selected
          );

          if (index >= 0) {
            await keyRingStore.deleteKeyRing(index, password);
            analyticsStore.logEvent("Account removed");

            if (keyRingStore.multiKeyStoreInfo.length === 0) {
              await keychainStore.reset();

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Unlock",
                  },
                ],
              });
            }
          }
        }}
      />
    </React.Fragment>
  );
});
