import React, { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "components/page";
import { useStyle } from "styles/index";
import {
  View,
  Image,
  ViewStyle,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { useSmartNavigation } from "navigation/smart-navigation";
import { useRegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/index";
import { CardModal } from "modals/card";
import { DownloadIcon } from "components/icon";
import { GoogleIcon } from "components/new/icon/google";
import { HeaderAddIcon } from "components/header/icon";
import { LinearGradientText } from "components/svg/linear-gradient-text";
import { BlurBackground } from "components/new/blur-background/blur-background";
import { IconButton } from "components/new/button/icon";
import { KeyIcon } from "components/new/icon/key_icon";
import { BluetoothIcon } from "components/new/icon/bluetooth-icon";
import { MetaMaskIcon } from "components/new/icon/metamask-icon";
import { TokenCardView } from "components/new/card-view/token-card-view";
import { AppleIcon } from "components/new/icon/apple";
import { FetchIcon } from "components/new/icon/fetch-icon";

const SelectWalletOptionCard: FunctionComponent<{
  setIsModalOpen: (val: boolean) => void;
  img: any;
  title: string;
  desc: string;
}> = ({ setIsModalOpen, img, title, desc }) => {
  const style = useStyle();

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setIsModalOpen(true);
        }}
        activeOpacity={1}
      >
        <BlurBackground
          blurIntensity={12}
          borderRadius={16}
          containerStyle={
            style.flatten(["padding-18", "flex-row"]) as ViewStyle
          }
        >
          <IconButton
            iconStyle={style.flatten(["padding-8"]) as ViewStyle}
            icon={img}
            backgroundBlur={true}
            blurIntensity={25}
          />
          <View style={style.flatten(["padding-x-24"]) as ViewStyle}>
            <Text
              style={
                style.flatten([
                  "font-extrabold",
                  "h5",
                  "margin-bottom-10",
                  "color-white",
                ]) as ViewStyle
              }
            >
              {title}
            </Text>
            <Text style={style.flatten(["color-gray-100", "h7"]) as ViewStyle}>
              {desc}
            </Text>
          </View>
        </BlurBackground>
      </TouchableOpacity>
    </React.Fragment>
  );
};

export const RegisterIntroScreen: FunctionComponent = observer(() => {
  const { keyRingStore } = useStore();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const registerConfig = useRegisterConfig(keyRingStore, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportWalletModalOpen, setImportWalletModalOpen] = useState(false);

  console.log("Click: Register", isModalOpen, isImportWalletModalOpen);
  return (
    <PageWithScrollView
      backgroundMode="image"
      contentContainerStyle={style.get("flex-grow-1")}
      style={{
        ...(style.flatten(["padding-x-15", "padding-bottom-15"]) as ViewStyle),
      }}
    >
      <View style={style.flatten(["justify-between"]) as ViewStyle}>
        <View style={style.flatten(["items-center"]) as ViewStyle}>
          <Image
            source={require("assets/logo/logo.png")}
            style={{
              // height: 80,
              aspectRatio: 2.977,
            }}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
        <View style={{ display: "flex", gap: 12, marginTop: 30 }}>
          <View style={style.flatten(["padding-x-2"]) as ViewStyle}>
            <Text
              style={
                style.flatten([
                  "h1",
                  "font-medium",
                  "color-white",
                  "padding-top-10",
                ]) as ViewStyle
              }
            >
              Welcome to your
            </Text>
            <LinearGradientText
              text="Fetch Wallet"
              color1="#CF447B"
              color2="#F9774B"
              textCenter={false}
            />
            <Text
              style={
                style.flatten([
                  "h6",
                  "color-gray-100",
                  "padding-y-24",
                ]) as ViewStyle
              }
            >
              Choose how you want to proceed
            </Text>
          </View>
          <SelectWalletOptionCard
            setIsModalOpen={setIsModalOpen}
            img={<HeaderAddIcon color="white" size={20} />}
            title="Create a new wallet"
            desc="Create a wallet to store, send, receive and invest in thousands of crypto assets"
          />
          <SelectWalletOptionCard
            setIsModalOpen={setImportWalletModalOpen}
            img={<DownloadIcon color="white" size={20} />}
            title="Import a wallet"
            desc="Access your existing wallet using a recovery phrase / private key"
          />
          <NewWalletModal
            isOpen={isModalOpen}
            close={() => setIsModalOpen(false)}
            onSelectGoogle={() => {
              setIsModalOpen(false);
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "google",
              });
            }}
            onSelectApple={() => {
              setIsModalOpen(false);
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "apple",
              });
            }}
            onSelectNewMnemonic={() => {
              setIsModalOpen(false);
              smartNavigation.navigateSmart("Register.NewMnemonic", {
                registerConfig,
              });
            }}
          />
          <ImportExistingWalletModal
            isOpen={isImportWalletModalOpen}
            close={() => setImportWalletModalOpen(false)}
            onSelectGoogle={() => {
              setImportWalletModalOpen(false);
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "google",
              });
            }}
            onImportExistingWallet={() => {
              setImportWalletModalOpen(false);
              smartNavigation.navigateSmart("Register.RecoverMnemonic", {
                registerConfig,
              });
            }}
            onMigrateFromETH={() => {
              setImportWalletModalOpen(false);
              smartNavigation.navigateSmart("Register.MigrateETH", {
                registerConfig,
              });
            }}
            onImportFromFetch={() => {
              setImportWalletModalOpen(false);
              smartNavigation.navigateSmart(
                "Register.ImportFromExtension.Intro",
                {
                  registerConfig,
                }
              );
            }}
            onConnectLedger={() => {
              setImportWalletModalOpen(false);
              smartNavigation.navigateSmart("Register.NewLedger", {
                registerConfig,
              });
            }}
          />
        </View>
      </View>
    </PageWithScrollView>
  );
});

export const NewWalletModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  onSelectGoogle: () => void;
  onSelectApple: () => void;
  onSelectNewMnemonic: () => void;
}> = observer(
  ({ isOpen, onSelectGoogle, onSelectApple, onSelectNewMnemonic, close }) => {
    const style = useStyle();

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        isOpen={isOpen}
        title="Create a new wallet"
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        close={() => close()}
      >
        <TokenCardView
          title="Continue with Google"
          leadingIcon={<GoogleIcon width={30} height={30} />}
          subtitle={"Powered by Web3Auth"}
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          onPress={() => {
            onSelectGoogle();
          }}
        />
        {Platform.OS === "ios" ? (
          <TokenCardView
            title="Continue with Apple"
            leadingIcon={<AppleIcon width={30} height={30} />}
            containerStyle={
              style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
            }
            titleStyle={
              style.flatten(["text-caption1", "font-medium"]) as ViewStyle
            }
            onPress={() => {
              onSelectApple();
            }}
          />
        ) : null}

        <TokenCardView
          title="Create new seed phrase"
          leadingIcon={
            <BlurBackground blurIntensity={18}>
              <KeyIcon width={30} height={30} />
            </BlurBackground>
          }
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          onPress={() => {
            onSelectNewMnemonic();
          }}
        />
      </CardModal>
    );
  }
);

export const ImportExistingWalletModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  onSelectGoogle: () => void;
  onImportExistingWallet: () => void;
  onImportFromFetch: () => void;
  onConnectLedger: () => void;
  onMigrateFromETH: () => void;
}> = observer(
  ({
    isOpen,
    onImportExistingWallet,
    onImportFromFetch,
    onConnectLedger,
    onMigrateFromETH,
    close,
  }) => {
    const style = useStyle();

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        isOpen={isOpen}
        title="Import existing wallet"
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        close={() => close()}
      >
        <TokenCardView
          title="Import from Fetch extension"
          leadingIcon={<FetchIcon size={30} />}
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          onPress={onImportFromFetch}
        />
        <TokenCardView
          title="Use a seed phrase or a private key"
          leadingIcon={
            <BlurBackground blurIntensity={18}>
              <KeyIcon width={30} height={30} />
            </BlurBackground>
          }
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          onPress={onImportExistingWallet}
        />
        <TokenCardView
          title="Connect hardware wallet"
          leadingIcon={
            <BlurBackground blurIntensity={18}>
              <BluetoothIcon width={30} height={30} />
            </BlurBackground>
          }
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          subtitle={"Requires bluetooth access to pair"}
          onPress={onConnectLedger}
        />
        <TokenCardView
          title="Migrate from ETH"
          leadingIcon={
            <BlurBackground blurIntensity={18}>
              <MetaMaskIcon size={30} />
            </BlurBackground>
          }
          containerStyle={
            style.flatten(["margin-bottom-6", "height-80"]) as ViewStyle
          }
          titleStyle={
            style.flatten(["text-caption1", "font-medium"]) as ViewStyle
          }
          onPress={() => {
            onMigrateFromETH();
          }}
        />
      </CardModal>
    );
  }
);
