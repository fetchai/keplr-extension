import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import { PasswordInput } from "../../components/form";
// import WalletConnectManager from "../../../../../packages/mobile/src/stores/wallet-connect"

import { Button, Form } from "reactstrap";

import { observer } from "mobx-react-lite";
import useForm from "react-hook-form";
import { Banner } from "../../components/banner";
import { useStore } from "../../stores";

import { EmptyLayout } from "../../layouts/empty-layout";

import style from "./style.module.scss";

import { useInteractionInfo } from "@keplr-wallet/hooks";
import delay from "delay";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";
import { getJWT } from "../../utils/auth";
import { toHex } from "@cosmjs/encoding";

interface FormData {
  password: string;
}

export const LockPage: FunctionComponent = observer(() => {
  const intl = useIntl();
  const history = useHistory();

  const passwordRef = useRef<HTMLInputElement | null>();

  const { register, handleSubmit, setError, errors } = useForm<FormData>({
    defaultValues: {
      password: "",
    },
  });

  // let client:WalletConnectManager
  // const keplr = WalletConnectManager.createKeplrAPI(client.session.key);
  // console.log(keplr);

  const { keyRingStore } = useStore();
  const [loading, setLoading] = useState(false);

  const interactionInfo = useInteractionInfo(() => {
    keyRingStore.rejectAll();
  });

  useEffect(() => {
    if (passwordRef.current) {
      // Focus the password input on enter.
      passwordRef.current.focus();
    }
  }, []);

  return (
    <EmptyLayout style={{ backgroundColor: "white", height: "100%" }}>
      <Form
        className={style.formContainer}
        // onSubmit={()=>{}}
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          //@ts-ignore "required to run below code"

          try {
            keyRingStore.unlock(data.password);
            if (interactionInfo.interaction) {
              if (!interactionInfo.interactionInternal) {
                // XXX: If the connection doesn't have the permission,
                //      permission service tries to grant the permission right after unlocking.
                //      Thus, due to the yet uncertain reason, it requests new interaction for granting permission
                //      before the `window.close()`. And, it could make the permission page closed right after page changes.
                //      Unfortunately, I still don't know the exact cause.
                //      Anyway, for now, to reduce this problem, jsut wait small time, and close the window only if the page is not changed.
                await delay(100);
                if (window.location.href.includes("#/unlock")) {
                  window.close();
                }
              } else {
                history.replace("/");
              }
            }
          } catch (e: any) {
            console.log("Fail to decrypt: " + e.message);
            setError(
              "password",
              "invalid",
              intl.formatMessage({
                id: "lock.input.password.error.invalid",
              })
            );
            setLoading(false);
          }
        })}
      >
        <Banner
          icon={require("../../public/assets/temp-icon.svg")}
          logo={require("../../public/assets/logo-temp.png")}
        />
        <PasswordInput
          label={intl.formatMessage({
            id: "lock.input.password",
          })}
          name="password"
          error={errors.password && errors.password.message}
          ref={(ref) => {
            passwordRef.current = ref;

            register({
              required: intl.formatMessage({
                id: "lock.input.password.error.required",
              }),
            })(ref);
          }}
        />
        <Button type="submit" color="primary" block data-loading={loading}>
          <FormattedMessage id="lock.button.unlock" />
        </Button>
      </Form>
    </EmptyLayout>
  );
});
