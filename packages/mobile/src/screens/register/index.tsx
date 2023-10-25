import React, { FunctionComponent, useState } from "react";
import { PageWithScrollView } from "../../components/page";
import { useStyle } from "../../styles";
import {
  View,
  Image,
  ViewStyle,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Button } from "../../components/button";
import { useSmartNavigation } from "../../navigation";
import { useRegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { registerModal } from "../../modals/base";
import { CardModal } from "../../modals/card";
import {
  AppleIcon,
  DownloadIcon,
  GoogleIcon,
  RightArrowWithBarIcon,
} from "../../components/icon";
import { HeaderAddIcon } from "../../components/header/icon";
import { BlurView } from "@react-native-community/blur";

const SelectWalletOptionCard: FunctionComponent<{
  setIsModalOpen: (val: boolean) => void;
  img: any;
  title: string;
  desc: string;
  onPress: () => void;
}> = ({ setIsModalOpen, img, title, desc, onPress }) => {
  const style = useStyle();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        setIsModalOpen(true);
      }}
      activeOpacity={1}
    >
      <BlurView
        blurRadius={10}
        blurType="xlight"
        reducedTransparencyFallbackColor=""
        overlayColor=""
      >
        <View
          style={{
            ...(style.flatten([
              "border-radius-12",
              "padding-left-10",
              "padding-right-10",
              "padding-top-15",
              "padding-bottom-15",
              // "background-color-white",
              // "blurred-tabbar-top-border",
              // "relative",
              // "overflow-hidden",
              "border-width-1",
              "border-color-gray-100@50%",
            ]) as ViewStyle),
          }}
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
                "background-color-blue-400",
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
          <Text style={style.flatten(["color-white@35%"]) as ViewStyle}>
            {desc}
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

export const RegisterIntroScreen: FunctionComponent = observer(() => {
  const { keyRingStore, analyticsStore } = useStore();

  const style = useStyle();

  const smartNavigation = useSmartNavigation();

  const registerConfig = useRegisterConfig(keyRingStore, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportWalletModalOpen, setIsmportWalletModalOpen] = useState(false);
  const [showBlurredBg, setShowBlurredBg] = useState(false);

  return (
    <PageWithScrollView
      backgroundMode={showBlurredBg ? "image" : "image"}
      contentContainerStyle={style.get("flex-grow-1")}
      style={{
        ...(style.flatten(["padding-x-15", "padding-bottom-15"]) as ViewStyle),
      }}
    >
      <View style={style.flatten(["flex", "flex-1", "justify-between"])}>
        <View style={style.flatten(["items-center"]) as ViewStyle}>
          <Image
            source={
              style.theme === "dark"
                ? require("../../assets/logo/logo-white.png")
                : require("../../assets/logo/logo-white.png")
            }
            style={{
              height: 45,
              aspectRatio: 2.977,
            }}
            resizeMode="contain"
            fadeDuration={0}
          />
        </View>
        <View>
          <Text
            style={style.flatten([
              "text-center",
              "headingText1",
              "color-white",
            ])}
          >
            Welcome to Fetch Wallet
          </Text>
        </View>
        <View style={{ display: "flex", gap: 20 }}>
          <SelectWalletOptionCard
            setIsModalOpen={setIsModalOpen}
            img={<HeaderAddIcon color="#fff" size={20} />}
            title="Create a new wallet"
            desc="This will create a new wallet and a Secret Recovery Phrase"
            onPress={() => setShowBlurredBg(true)}
          />
          <SelectWalletOptionCard
            setIsModalOpen={setIsmportWalletModalOpen}
            img={<DownloadIcon color="#fff" size={18} />}
            title="Import existing wallet"
            desc="Access your existing wallet using your Secret Recovery Phrase"
            onPress={() => setShowBlurredBg(true)}
          />
          <NewWalletModal
            isOpen={isModalOpen}
            close={() => {
              setShowBlurredBg(false);
              setIsModalOpen(false);
            }}
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
            setShowBlurredBg={setShowBlurredBg}
          />
          <ImportExistingWalletModal
            isOpen={isImportWalletModalOpen}
            close={() => {
              setShowBlurredBg(false);
              setIsmportWalletModalOpen(false);
            }}
            onSelectGoogle={() => {
              setIsmportWalletModalOpen(false);
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
              setIsmportWalletModalOpen(false);
              analyticsStore.logEvent("Import account started", {
                registerType: "seed",
              });
              smartNavigation.navigateSmart("Register.RecoverMnemonic", {
                registerConfig,
              });
            }}
            onImportFromFetch={() => {
              setIsmportWalletModalOpen(false);
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
  setShowBlurredBg: (val: boolean) => void;
}> = registerModal(
  observer(
    ({
      isOpen,
      onSelectGoogle,
      onSelectApple,
      onSelectNewMnemonic,
      setShowBlurredBg,
    }) => {
      const style = useStyle();

      if (!isOpen) {
        return null;
      }

      return (
        <CardModal title="Create a new wallet">
          {Platform.OS === "ios" ? (
            <Button
              containerStyle={{
                marginBottom: 15,
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
              text="Continue with Apple"
              leftIcon={
                <View style={style.flatten(["margin-right-6"]) as ViewStyle}>
                  <AppleIcon />
                </View>
              }
              size="default"
              mode="outline"
              onPress={() => {
                onSelectApple();
              }}
            />
          ) : null}

          <Button
            containerStyle={{
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
            text="Continue with Google"
            leftIcon={
              <View style={style.flatten(["margin-right-6"]) as ViewStyle}>
                <GoogleIcon />
              </View>
            }
            size="default"
            mode="outline"
            onPress={() => {
              setShowBlurredBg(true);
              onSelectGoogle();
            }}
          />
          <Text style={style.flatten(["text-center", "color-platinum-300"])}>
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
                  "background-color-platinum-300",
                  "flex-1",
                ]) as ViewStyle
              }
            />
            <Text
              style={
                style.flatten([
                  "margin-x-15",
                  "font-bold",
                  "color-platinum-300",
                ]) as ViewStyle
              }
            >
              OR
            </Text>
            <View
              style={
                style.flatten([
                  "height-1",
                  "background-color-platinum-300",
                  "flex-1",
                ]) as ViewStyle
              }
            />
          </View>
          <Button
            containerStyle={style.flatten([
              "background-color-white",
              "border-radius-64",
            ])}
            textStyle={
              style.flatten(["color-black", "margin-right-12"]) as ViewStyle
            }
            rightIcon={<RightArrowWithBarIcon color="black" size={20} />}
            text="Create new mnemonic"
            size="default"
            onPress={() => {
              onSelectNewMnemonic();
            }}
          />
        </CardModal>
      );
    }
  ),
  {
    disableSafeArea: true,
  }
);

export const ImportExistingWalletModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  onSelectGoogle: () => void;
  onSelectApple: () => void;
  onImportExistingWallet: () => void;
  onImportFromFetch: () => void;
}> = registerModal(
  observer(
    ({
      isOpen,
      onSelectGoogle,
      onImportExistingWallet,
      onImportFromFetch,
      onSelectApple,
    }) => {
      const style = useStyle();

      if (!isOpen) {
        return null;
      }

      return (
        <CardModal title="Import existing wallet">
          {Platform.OS === "ios" ? (
            <Button
              containerStyle={{
                marginBottom: 15,
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
              text="Continue with Apple"
              leftIcon={
                <View style={style.flatten(["margin-right-6"]) as ViewStyle}>
                  <AppleIcon />
                </View>
              }
              size="default"
              mode="outline"
              onPress={() => {
                onSelectApple();
              }}
            />
          ) : null}

          <Button
            containerStyle={{
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
            text="Continue with Google"
            leftIcon={
              <View style={style.flatten(["margin-right-6"]) as ViewStyle}>
                <GoogleIcon />
              </View>
            }
            size="default"
            mode="outline"
            onPress={() => {
              onSelectGoogle();
            }}
          />
          <Text style={style.flatten(["text-center", "color-platinum-300"])}>
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
                  "background-color-platinum-300",
                  "flex-1",
                ]) as ViewStyle
              }
            />
            <Text
              style={
                style.flatten([
                  "margin-x-15",
                  "font-bold",
                  "color-platinum-300",
                ]) as ViewStyle
              }
            >
              OR
            </Text>
            <View
              style={
                style.flatten([
                  "height-1",
                  "background-color-platinum-300",
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
                "border-radius-64",
                "border-color-white@45%",
              ]) as ViewStyle
            }
            textStyle={style.flatten(["color-white"]) as ViewStyle}
            onPress={() => {
              onImportFromFetch();
            }}
          />
          <Button
            text="Import existing wallet"
            size="default"
            containerStyle={style.flatten([
              "background-color-white",
              "border-radius-64",
            ])}
            textStyle={style.flatten(["color-dark-blue"]) as ViewStyle}
            onPress={() => {
              onImportExistingWallet();
            }}
          />
        </CardModal>
      );
    }
  ),
  {
    disableSafeArea: true,
  }
);
