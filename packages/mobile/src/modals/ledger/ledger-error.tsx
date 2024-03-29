import { observer } from "mobx-react-lite";
import { registerModal } from "modals/base";
import { CardModal } from "modals/card";
import React, { FunctionComponent } from "react";
import { LedgerErrorView } from "modals/ledger/ledger-error-view";
import { ViewStyle } from "react-native";
import { Button } from "components/button";
import { useStyle } from "styles/index";
export const LedgerLocationErrorModel: FunctionComponent<{
  error: string;
  isOpen: boolean;
  close: () => void;
  retry: () => void;
}> = registerModal(
  observer(({ error, close, retry }) => {
    const style = useStyle();

    return (
      <CardModal title="Location Permission" close={() => close()}>
        <LedgerErrorView text={error}>
          <Button
            text="Retry"
            size="large"
            onPress={() => {
              retry();
              close();
            }}
            containerStyle={
              style.flatten([
                "border-radius-32",
                "width-full",
                "margin-top-12",
              ]) as ViewStyle
            }
          />
        </LedgerErrorView>
      </CardModal>
    );
  }),
  {
    disableSafeArea: true,
  }
);
