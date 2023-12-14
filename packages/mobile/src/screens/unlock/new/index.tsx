import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Image, TouchableOpacity, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { useStyle } from "../../../styles";
import * as SplashScreen from "expo-splash-screen";
import { TextInput } from "../../../components/input";
import { Button } from "../../../components/button";
import delay from "delay";
import { useStore } from "../../../stores";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, useNavigation } from "@react-navigation/native";
import { KeyRingStatus } from "@keplr-wallet/background";
import { KeychainStore } from "../../../stores/keychain";
import { IAccountStore } from "@keplr-wallet/stores";
import { autorun } from "mobx";
import { FingerprintIcon } from "../../../components/icon/fingerprint";
import { ScreenBackground } from "../../../components/page/background";
import { ColorRightErrow } from "../../../components/icon/color-rightt-arrow";
import { LinearGradientText } from "../../../components/svg/linear-gradient-text";

let splashScreenHided = false;
async function hideSplashScreen() {
  if (!splashScreenHided) {
    if (await SplashScreen.hideAsync()) {
      splashScreenHided = true;
    }
  }
}

async function waitAccountLoad(
  accountStore: IAccountStore,
  chainId: string
): Promise<void> {
  if (accountStore.getAccount(chainId).bech32Address) {
    return;
  }

  return new Promise((resolve) => {
    const disposer = autorun(() => {
      if (accountStore.getAccount(chainId).bech32Address) {
        resolve();
        if (disposer) {
          disposer();
        }
      }
    });
  });
}

/*
 If the biomeric is on, just try to unlock by biometric automatically once.
 */
enum AutoBiomtricStatus {
  NO_NEED,
  NEED,
  FAILED,
  SUCCESS,
}

const useAutoBiomtric = (
  keychainStore: KeychainStore,
  tryEnabled: boolean,
  callback: (isLoading: boolean) => void
) => {
  const [status, setStatus] = useState(AutoBiomtricStatus.NO_NEED);
  const tryBiometricAutoOnce = useRef(false);

  useEffect(() => {
    if (keychainStore.isBiometryOn && status === AutoBiomtricStatus.NO_NEED) {
      setStatus(AutoBiomtricStatus.NEED);
    }
  }, [keychainStore.isBiometryOn, status]);

  useEffect(() => {
    if (
      !tryBiometricAutoOnce.current &&
      status === AutoBiomtricStatus.NEED &&
      tryEnabled
    ) {
      tryBiometricAutoOnce.current = true;
      (async () => {
        try {
          callback(true);
          await keychainStore.tryUnlockWithBiometry();
          setStatus(AutoBiomtricStatus.SUCCESS);
        } catch (e) {
          console.log(e);
          setStatus(AutoBiomtricStatus.FAILED);
        } finally {
          callback(false);
        }
      })();
    }
  }, [keychainStore, status, tryEnabled]);

  return status;
};

/**
 * UnlockScreen is expected to be opened when the keyring store's state is "not loaded (yet)" or "locked" at launch.
 * And, this screen has continuity with the splash screen
 * @constructor
 */
export const UnlockScreen: FunctionComponent = observer(() => {
  const { keyRingStore, keychainStore, accountStore, chainStore } = useStore();

  const style = useStyle();

  const navigation = useNavigation();

  const navigateToHomeOnce = useRef(false);
  const navigateToHome = useCallback(async () => {
    if (!navigateToHomeOnce.current) {
      // Wait the account of selected chain is loaded.
      await waitAccountLoad(accountStore, chainStore.current.chainId);
      navigation.dispatch(StackActions.replace("MainTabDrawer"));
    }
    navigateToHomeOnce.current = true;
  }, [accountStore, chainStore, navigation]);

  const autoBiometryStatus = useAutoBiomtric(
    keychainStore,
    keyRingStore.status === KeyRingStatus.LOCKED,
    (isLoading) => {
      setIsBiometricLoading(isLoading);
    }
  );

  useEffect(() => {
    if (autoBiometryStatus === AutoBiomtricStatus.SUCCESS) {
      (async () => {
        await hideSplashScreen();
      })();
    }
  }, [autoBiometryStatus, navigation]);

  useEffect(() => {
    if (keyRingStore.status === KeyRingStatus.LOCKED) hideSplashScreen();
  }, [keyRingStore.status]);

  const [password, setPassword] = useState("12345678");
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const tryBiometric = useCallback(async () => {
    try {
      setIsBiometricLoading(true);
      // Because javascript is synchronous language, the loadnig state change would not delivered to the UI thread
      // So to make sure that the loading state changes, just wait very short time.
      await delay(10);
      await keychainStore.tryUnlockWithBiometry();
    } catch (e) {
      console.log(e);
      setIsBiometricLoading(false);
    }
  }, [keychainStore]);

  const tryUnlock = async () => {
    try {
      setIsLoading(true);
      // Decryption needs slightly huge computation.
      // Because javascript is synchronous language, the loadnig state change would not delivered to the UI thread
      // before the actually decryption is complete.
      // So to make sure that the loading state changes, just wait very short time.
      await delay(10);
      await keyRingStore.unlock(password);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setIsFailed(true);
    }
  };

  const routeToRegisterOnce = useRef(false);
  useEffect(() => {
    // If the keyring is empty,
    // route to the register screen.
    if (
      !routeToRegisterOnce.current &&
      keyRingStore.status === KeyRingStatus.EMPTY
    ) {
      (async () => {
        routeToRegisterOnce.current = true;
        navigation.dispatch(
          StackActions.replace("Register", {
            screen: "Register.Intro",
          })
        );
        await delay(1000);
        hideSplashScreen();
      })();
    }
  }, [keyRingStore.status, navigation]);

  useEffect(() => {
    if (keyRingStore.status === KeyRingStatus.UNLOCKED) {
      navigateToHome();
    }
  }, [keyRingStore.status, navigateToHome]);

  if (
    [KeyRingStatus.EMPTY, KeyRingStatus.NOTLOADED].includes(keyRingStore.status)
  ) {
    return null;
  }

  return (
    <React.Fragment>
      <ScreenBackground backgroundMode="image" backgroundBlur={true} />
      <View style={style.flatten(["flex", "flex-1", "justify-between"])}>
        <KeyboardAwareScrollView
          contentContainerStyle={style.flatten(["flex-grow-1"])}
          indicatorStyle={style.theme === "dark" ? "white" : "black"}
        >
          <View style={style.get("flex-3")} />
          <View style={style.flatten(["flex-5", "items-center"]) as ViewStyle}>
            <Image
              source={
                style.theme === "dark"
                  ? require("../../../assets/logo/logo.png")
                  : require("../../../assets/logo/logo.png")
              }
              style={{
                height: 80,
                aspectRatio: 2.977,
              }}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
          <View>
            <LinearGradientText
              text="Welcome back"
              color1="#CF447B"
              color2="#F9774B"
            />

            {/* <Text style={style.flatten(["text-center", "h1", "font-medium", "color-linear"])}>
              Welcome back
            </Text> */}
          </View>
          <View style={style.flatten(["padding-x-page"]) as ViewStyle}>
            <TextInput
              containerStyle={
                style.flatten([
                  "padding-top-40",
                  "padding-bottom-40",
                ]) as ViewStyle
              }
              returnKeyType="done"
              secureTextEntry={true}
              value={password}
              error={isFailed ? "Invalid password" : undefined}
              onChangeText={setPassword}
              onSubmitEditing={tryUnlock}
              placeholder="Password"
              placeholderTextColor={"white"}
            />
            <Button
              containerStyle={style.flatten([
                "background-color-white",
                "border-radius-32",
              ])}
              textStyle={{
                color: "#0B1742",
              }}
              text="Sign in"
              rightIcon={
                <View style={style.flatten(["margin-left-10"]) as ViewStyle}>
                  <ColorRightErrow />
                </View>
              }
              size="large"
              loading={isLoading}
              loadingSpinnerColor="color-indigo-900"
              rippleColor="black@50%"
              onPress={tryUnlock}
            />
          </View>
          <View style={style.get("flex-4")} />
          {keychainStore.isBiometryOn ? (
            <TouchableOpacity onPress={tryBiometric} activeOpacity={1}>
              <View
                style={style.flatten(["flex", "margin-bottom-40"]) as ViewStyle}
              >
                <View style={style.flatten(["items-center"]) as ViewStyle}>
                  <FingerprintIcon color={style.get("color-blue-400").color} />
                </View>
                <Button
                  textStyle={style.flatten(["color-black", "h5"]) as ViewStyle}
                  text="Use biometric authentication"
                  mode="text"
                  loading={isBiometricLoading}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </KeyboardAwareScrollView>
      </View>
    </React.Fragment>
  );
});

// const UnlockScreenGradientBackground: FunctionComponent = () => {
//   const style = useStyle();

//   return (
//     <View style={style.flatten(["absolute-fill"])}>
//       <ScreenBackground backgroundMode="blurImage" />
//     </View>
//   );
// };
