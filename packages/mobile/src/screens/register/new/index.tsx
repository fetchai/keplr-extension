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
import { Button } from "components/button";
import { useSmartNavigation } from "navigation/smart-navigation";
import { useRegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/index";
import { registerModal } from "modals/base";
import { CardModal } from "modals/card";
import { AppleIcon, DownloadIcon, GoogleIcon } from "components/icon";
import { HeaderAddIcon } from "components/header/icon";
import { ColorRightArrow } from "components/icon/color-rightt-arrow";
import { LinearGradientText } from "components/svg/linear-gradient-text";
import { BlurBackground } from "components/new/blur-background/blur-background";

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
            style.flatten([
              "border-width-1",
              // "border-radius-16",
              "border-color-indigo-200",
              "padding-x-10",
              "padding-y-15",
              // "background-color-transparent"
            ]) as ViewStyle
          }
        >
          <View
            style={
              style.flatten([
                "border-radius-full",
                "self-start",
                "width-36",
                "height-36",
                "flex",
                "justify-center",
                "items-center",
                "background-color-indigo",
                "margin-bottom-8",
              ]) as ViewStyle
            }
          >
            {img}
          </View>

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
          <Text
            style={
              style.flatten([
                "color-text-middle@70%",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            {desc}
          </Text>
        </BlurBackground>
      </TouchableOpacity>
    </React.Fragment>
  );
};

export const RegisterIntroScreen: FunctionComponent = observer(() => {
  const { keyRingStore, analyticsStore } = useStore();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const registerConfig = useRegisterConfig(keyRingStore, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportWalletModalOpen, setImportWalletModalOpen] = useState(false);

  return (
    <PageWithScrollView
      backgroundMode="image"
      contentContainerStyle={style.get("flex-grow-1")}
      style={{
        ...(style.flatten(["padding-x-15", "padding-bottom-15"]) as ViewStyle),
      }}
    >
      <View style={style.flatten(["flex", "flex-1", "justify-between"])}>
        <View style={style.flatten(["items-center"]) as ViewStyle}>
          <Image
            source={require("assets/logo/logo.png")}
            style={{
              height: 80,
              aspectRatio: 2.977,
            }}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
        <LinearGradientText
          text="Welcome to Fetch Wallet"
          color1="#CF447B"
          color2="#F9774B"
        />
        <View style={{ display: "flex", gap: 20 }}>
          <SelectWalletOptionCard
            setIsModalOpen={setIsModalOpen}
            img={<HeaderAddIcon color="white" size={20} />}
            title="Create a new wallet"
            desc="This will create a new wallet and a Secret Recovery Phrase"
          />
          <SelectWalletOptionCard
            setIsModalOpen={setImportWalletModalOpen}
            img={<DownloadIcon color="white" size={18} />}
            title="Import existing wallet"
            desc="Access your existing wallet using your Secret Recovery Phrase"
          />
          <NewWalletModal
            isOpen={isModalOpen}
            close={() => setIsModalOpen(false)}
            onSelectGoogle={() => {
              setIsModalOpen(false);
              analyticsStore.logEvent("OAuth sign in started", {
                registerType: "google",
              });
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "google",
              });
            }}
            onSelectApple={() => {
              setIsModalOpen(false);
              analyticsStore.logEvent("OAuth sign in started", {
                registerType: "apple",
              });
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "apple",
              });
            }}
            onSelectNewMnemonic={() => {
              setIsModalOpen(false);
              analyticsStore.logEvent("Create account started", {
                registerType: "seed",
              });
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
              analyticsStore.logEvent("OAuth sign in started", {
                registerType: "google",
              });
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "google",
              });
            }}
            onSelectApple={() => {
              analyticsStore.logEvent("OAuth sign in started", {
                registerType: "apple",
              });
              smartNavigation.navigateSmart("Register.TorusSignIn", {
                registerConfig,
                type: "apple",
              });
            }}
            onImportExistingWallet={() => {
              setImportWalletModalOpen(false);
              analyticsStore.logEvent("Import account started", {
                registerType: "seed",
              });
              smartNavigation.navigateSmart("Register.RecoverMnemonic", {
                registerConfig,
              });
            }}
            onMigrateFromETH={() => {
              setImportWalletModalOpen(false);
              analyticsStore.logEvent("Import account started", {
                registerType: "seed",
              });
              smartNavigation.navigateSmart("Register.MigrateETH", {
                registerConfig,
              });
            }}
            onImportFromFetch={() => {
              setImportWalletModalOpen(false);
              analyticsStore.logEvent("Import account started", {
                registerType: "qr",
              });
              smartNavigation.navigateSmart(
                "Register.ImportFromExtension.Intro",
                {
                  registerConfig,
                }
              );
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
}> = registerModal(
  observer(({ isOpen, onSelectGoogle, onSelectApple, onSelectNewMnemonic }) => {
    const style = useStyle();

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        title="Create a new wallet"
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
      >
        {Platform.OS === "ios" ? (
          <Button
            containerStyle={{
              height: 58,
              marginTop: 6,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
              backgroundColor: "#fff",
              borderWidth: 0,
            }}
            textStyle={{
              color: "#64646D",
            }}
            text="Continue with Apple"
            leftIcon={
              <View style={style.flatten(["margin-right-12"]) as ViewStyle}>
                <AppleIcon width={30} height={30} />
              </View>
            }
            size="xlarge"
            mode="outline"
            onPress={() => {
              onSelectApple();
            }}
          />
        ) : null}

        <Button
          containerStyle={{
            height: 58,
            marginTop: 6,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 2,
            backgroundColor: "#fff",
            borderWidth: 0,
          }}
          textStyle={{
            color: "#64646D",
          }}
          text="Continue with Google"
          leftIcon={
            <View style={style.flatten(["margin-right-12"]) as ViewStyle}>
              <GoogleIcon width={30} height={30} />
            </View>
          }
          size="xlarge"
          mode="outline"
          onPress={() => {
            onSelectGoogle();
          }}
        />
        <Text style={style.flatten(["text-center", "color-gray-200"])}>
          Powered by Web3Auth
        </Text>
        <View
          style={
            style.flatten([
              "flex",
              "flex-row",
              "items-center",
              "justify-between",
              "margin-y-20",
            ]) as ViewStyle
          }
        >
          <View
            style={
              style.flatten([
                "height-1",
                "background-color-gray-200",
                "flex-1",
              ]) as ViewStyle
            }
          />
          <Text
            style={
              style.flatten([
                "margin-x-15",
                "font-bold",
                "color-gray-200",
              ]) as ViewStyle
            }
          >
            OR
          </Text>
          <View
            style={
              style.flatten([
                "height-1",
                "background-color-gray-200",
                "flex-1",
              ]) as ViewStyle
            }
          />
        </View>
        <Button
          containerStyle={style.flatten([
            "background-color-white",
            "border-radius-32",
          ])}
          textStyle={{
            color: "#0B1742",
          }}
          text="Create new mnemonic"
          rightIcon={
            <View style={style.flatten(["margin-left-10"]) as ViewStyle}>
              <ColorRightArrow />
            </View>
          }
          size="default"
          onPress={() => {
            onSelectNewMnemonic();
          }}
        />
      </CardModal>
    );
  }),
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);

export const ImportExistingWalletModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  onSelectGoogle: () => void;
  onSelectApple: () => void;
  onImportExistingWallet: () => void;
  onImportFromFetch: () => void;
  onMigrateFromETH: () => void;
}> = registerModal(
  observer(
    ({
      isOpen,
      onSelectGoogle,
      onImportExistingWallet,
      onImportFromFetch,
      onMigrateFromETH,
      onSelectApple,
    }) => {
      const style = useStyle();

      if (!isOpen) {
        return null;
      }

      return (
        <CardModal
          title="Import existing wallet"
          cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        >
          {Platform.OS === "ios" ? (
            <Button
              containerStyle={{
                height: 58,
                marginTop: 6,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,

                elevation: 2,
                backgroundColor: "#fff",
                borderWidth: 0,
              }}
              textStyle={{
                color: "#64646D",
              }}
              text="Continue with Apple"
              leftIcon={
                <View style={style.flatten(["margin-right-12"]) as ViewStyle}>
                  <AppleIcon width={30} height={30} />
                </View>
              }
              size="xlarge"
              mode="outline"
              onPress={() => {
                onSelectApple();
              }}
            />
          ) : null}

          <Button
            containerStyle={{
              height: 58,
              marginTop: 6,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
              backgroundColor: "#fff",
              borderWidth: 0,
            }}
            textStyle={{
              color: "#64646D",
            }}
            text="Continue with Google"
            leftIcon={
              <View style={style.flatten(["margin-right-12"]) as ViewStyle}>
                <GoogleIcon width={30} height={30} />
              </View>
            }
            size="xlarge"
            mode="outline"
            onPress={() => {
              onSelectGoogle();
            }}
          />
          <Text style={style.flatten(["text-center", "color-gray-200"])}>
            Powered by Web3Auth
          </Text>
          <View
            style={
              style.flatten([
                "flex",
                "flex-row",
                "items-center",
                "justify-between",
                "margin-y-20",
              ]) as ViewStyle
            }
          >
            <View
              style={
                style.flatten([
                  "height-1",
                  "background-color-gray-200",
                  "flex-1",
                ]) as ViewStyle
              }
            />
            <Text
              style={
                style.flatten([
                  "margin-x-15",
                  "font-bold",
                  "color-gray-200",
                ]) as ViewStyle
              }
            >
              OR
            </Text>
            <View
              style={
                style.flatten([
                  "height-1",
                  "background-color-gray-200",
                  "flex-1",
                ]) as ViewStyle
              }
            />
          </View>
          <Button
            text="Import from Fetch Extension"
            size="default"
            mode="outline"
            containerStyle={
              style.flatten([
                "margin-bottom-10",
                "border-color-gray-200",
                "border-radius-32",
              ]) as ViewStyle
            }
            style={{
              borderColor: "gray-200",
            }}
            textStyle={{
              color: "white",
            }}
            onPress={() => {
              onImportFromFetch();
            }}
          />
          <Button
            containerStyle={
              style.flatten([
                "background-color-white",
                "border-radius-32",
                "margin-bottom-10",
              ]) as ViewStyle
            }
            textStyle={{
              color: "#0B1742",
            }}
            text="Import existing wallet"
            size="default"
            onPress={() => {
              onImportExistingWallet();
            }}
          />
          <Button
            containerStyle={
              style.flatten([
                "background-color-white",
                "border-radius-32",
              ]) as ViewStyle
            }
            textStyle={{
              color: "#0B1742",
            }}
            text="Migrate from ETH"
            size="default"
            onPress={() => {
              onMigrateFromETH();
            }}
          />
        </CardModal>
      );
    }
  ),
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
