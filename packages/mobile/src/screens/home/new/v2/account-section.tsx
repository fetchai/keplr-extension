import React, { FunctionComponent, useState } from "react";
import { Text, View, ViewStyle } from "react-native";
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
import { IconButton } from "components/new/button/icon";
import {
  ManageWalletOption,
  WalletCardModel,
} from "components/new/wallet-card/wallet-card";
import { ChangeWalletCardModel } from "components/new/wallet-card/change-wallet";
import { EditAccountNameModal } from "modals/edit-account-name.tsx";
import { PasswordInputModal } from "modals/password-input/modal";
import { useLoadingScreen } from "providers/loading-screen";
import { ChevronDownIcon } from "components/new/icon/chevron-down";
import { BarCodeIcon } from "components/new/icon/bar-code";
import { InboxIcon } from "components/new/icon/inbox-icon";
import { separateNumericAndDenom } from "utils/format/format";
import { BlurButton } from "components/new/button/blur-button";
import { ThreeDotIcon } from "components/new/icon/three-dot";
import { useSmartNavigation } from "navigation/smart-navigation";

export const AccountSection: FunctionComponent<{
  containtStyle?: ViewStyle;
  tokenState: any;
}> = observer(({ containtStyle, tokenState }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const smartNavigation = useSmartNavigation();
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
  const rewards = queries.cosmos.queryRewards.getQueryBech32Address(
    account.bech32Address
  );
  const stakableReward = rewards.stakableReward;

  const unbonding = queryUnbonding.total;

  const stakedSum = delegated.add(unbonding);

  const total = stakable.add(stakedSum).add(stakableReward);

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
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <View style={style.flatten(["flex-row"])}>
          <IconButton
            borderRadius={32}
            icon={<BarCodeIcon size={18} />}
            backgroundBlur={false}
            onPress={() => {
              smartNavigation.navigateSmart("Camera", {
                showMyQRButton: false,
              });
            }}
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
          <IconButton
            borderRadius={32}
            icon={<InboxIcon size={18} />}
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
              "padding-x-10",
              "padding-y-10",
              "border-width-1",
              "border-color-indigo-200",
            ]),
            containtStyle,
          ] as ViewStyle
        }
      >
        <View
          style={style.flatten(["margin-x-10", "margin-bottom-6"]) as ViewStyle}
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
        <IconButton
          backgroundBlur={false}
          icon={<ThreeDotIcon />}
          iconStyle={style.flatten(["padding-12"]) as ViewStyle}
          onPress={() => setIsOpenModal(true)}
        />
      </BlurBackground>
      <View style={style.flatten(["items-center"]) as ViewStyle}>
        <View style={style.flatten(["flex-row"]) as ViewStyle}>
          <Text style={style.flatten(["h1", "color-white"]) as ViewStyle}>
            {totalNumber}
          </Text>
          <Text
            style={
              style.flatten([
                "h1",
                "color-gray-400",
                "margin-left-8",
              ]) as ViewStyle
            }
          >
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
            <Text
              style={
                style.flatten([
                  "color-gray-300",
                  "h7",
                  "margin-left-8",
                ]) as ViewStyle
              }
            >
              {tokenState.time}
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
        onSelectWallet={(option: ManageWalletOption) => {
          switch (option) {
            case ManageWalletOption.addNewWallet:
              analyticsStore.logEvent("Add additional account started");
              navigation.navigate("Register", {
                screen: "Register.Intro",
              });
              break;

            case ManageWalletOption.changeWallet:
              setChangeWalletModal(true);
              setIsOpenModal(false);
              break;

            case ManageWalletOption.renameWallet:
              keyRingStore.multiKeyStoreInfo.map((keyStore) => {
                if (keyStore.meta?.["name"] === account.name) {
                  setSelectedKeyStore(keyStore);
                }
              });
              setIsRenameModalOpen(true);
              setIsOpenModal(false);
              break;

            case ManageWalletOption.deleteWallet:
              setIsDeleteModalOpen(true);
              setIsOpenModal(false);
              break;
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
