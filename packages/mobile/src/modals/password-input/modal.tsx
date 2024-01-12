import React, { FunctionComponent, useState } from "react";
import { registerModal } from "../base";
import { Text, ViewStyle } from "react-native";
import { useStyle } from "styles/index";
import { CardModal } from "../card";
import { TextInput } from "components/input";
import { Button } from "components/button";
import { KeyboardSpacerView } from "components/keyboard";
import { BorderlessButton } from "react-native-gesture-handler";
import { IconView } from "components/new/button/icon";
import { XmarkIcon } from "components/new/icon/xmark";

export const PasswordInputModal: FunctionComponent<{
  isOpen: boolean;
  close: () => void;
  title: string;
  paragraph?: string;
  /**
   * If any error thrown in the `onEnterPassword`, the password considered as invalid password.
   * @param password
   */
  onEnterPassword: (password: string) => Promise<void>;
}> = registerModal(
  ({ close, title, paragraph, onEnterPassword, isOpen }) => {
    const style = useStyle();

    const [password, setPassword] = useState("");
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const submitPassword = async () => {
      setIsLoading(true);
      try {
        await onEnterPassword(password);
        setIsInvalidPassword(false);
        setPassword("");
        close();
      } catch (e) {
        console.log(e);
        setIsInvalidPassword(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isOpen) {
      return null;
    }

    return (
      <CardModal
        title={title}
        cardStyle={style.flatten(["padding-bottom-32"]) as ViewStyle}
        right={
          <BorderlessButton
            rippleColor={style.get("color-rect-button-default-ripple").color}
            activeOpacity={0.3}
            onPress={() => close()}
          >
            <IconView
              img={<XmarkIcon color={"white"} />}
              backgroundBlur={false}
              blurIntensity={20}
              borderRadius={50}
              iconStyle={
                style.flatten([
                  "padding-12",
                  "border-width-1",
                  "border-color-gray-400",
                ]) as ViewStyle
              }
            />
          </BorderlessButton>
        }
      >
        <Text
          style={
            style.flatten([
              "body2",
              "color-text-middle",
              "margin-bottom-32",
            ]) as ViewStyle
          }
        >
          {paragraph || "Enter your password to continue"}
        </Text>
        <TextInput
          label="Password"
          error={isInvalidPassword ? "Invalid password" : undefined}
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          returnKeyType="done"
          secureTextEntry={true}
          onSubmitEditing={submitPassword}
        />
        <Button
          text="Approve"
          size="large"
          loading={isLoading}
          onPress={submitPassword}
          disabled={!password}
        />
        <KeyboardSpacerView />
      </CardModal>
    );
  },
  {
    disableSafeArea: true,
    blurBackdropOnIOS: true,
  }
);
