import React, { FunctionComponent, useState } from "react";
import { RegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Form } from "reactstrap";
import { Input } from "@components/form";
import { BackButton } from "../index";
import { AUTH_SERVER } from "../../../config.ui.var";
import { useForm } from "react-hook-form";
import { KeyRingStatus, SetKrPasswordMsg } from "@keplr-wallet/background";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import style from "../style.module.scss";
import { useStore } from "../../../stores";

interface FormData {
  password: string;
  confirmPassword: string;
}

export const TypeSync = "sync";

export const SyncIntro: FunctionComponent<{
  registerConfig: RegisterConfig;
}> = observer(({ registerConfig }) => {
  return (
    <React.Fragment>
      {registerConfig.mode === "create" && (
        <Button
          color="primary"
          outline
          block
          onClick={(e) => {
            e.preventDefault();

            registerConfig.setType(TypeSync);
          }}
        >
          <FormattedMessage id="register.sync.title" />
        </Button>
      )}
    </React.Fragment>
  );
});

const FAUNA_LOGIN_URL =
  `${AUTH_SERVER}/login` +
  `?redirect_uri=${encodeURIComponent(
    browser.extension.getURL("sync-auth.html")
  )}` +
  `&client_id=fetch_wallet` +
  `&response_type=code`;

export const SyncPage: FunctionComponent<{
  registerConfig: RegisterConfig;
}> = observer(({ registerConfig }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const intl = useIntl();
  const requester = new InExtensionMessageRequester();
  const { keyRingStore } = useStore();
  return (
    <div>
      <p>
        Hi, we will be syncing your accounts. Other blah blah security stuff
      </p>
      {keyRingStore.status === KeyRingStatus.EMPTY ? (
        <Form
          className={style["formContainer"]}
          onSubmit={handleSubmit(async (data: FormData) => {
            setSubmitLoading(true);
            // extract the private key
            await requester.sendMessage(
              BACKGROUND_PORT,
              new SetKrPasswordMsg(data.password)
            );

            window.location.replace(FAUNA_LOGIN_URL);
          })}
        >
          <Input
            label={intl.formatMessage({
              id: "register.create.input.password",
            })}
            type="password"
            {...register("password", {
              required: intl.formatMessage({
                id: "register.create.input.password.error.required",
              }),
              validate: (password: string): string | undefined => {
                if (password.length < 8) {
                  return intl.formatMessage({
                    id: "register.create.input.password.error.too-short",
                  });
                }
              },
            })}
            error={errors.password && errors.password.message}
          />
          <Input
            label={intl.formatMessage({
              id: "register.create.input.confirm-password",
            })}
            type="password"
            {...register("confirmPassword", {
              required: intl.formatMessage({
                id: "register.create.input.confirm-password.error.required",
              }),
              validate: (confirmPassword: string): string | undefined => {
                if (confirmPassword !== getValues()["password"]) {
                  return intl.formatMessage({
                    id: "register.create.input.confirm-password.error.unmatched",
                  });
                }
              },
            })}
            error={errors.confirmPassword && errors.confirmPassword.message}
          />
          <Button
            color="primary"
            type="submit"
            block
            data-loading={submitLoading}
          >
            Sync Accounts
          </Button>
        </Form>
      ) : (
        <Button
          color="primary"
          type="submit"
          block
          onClick={(e) => {
            e.preventDefault();
            setSubmitLoading(true);
            window.location.replace(FAUNA_LOGIN_URL);
          }}
          data-loading={submitLoading}
        >
          Sync Accounts
        </Button>
      )}
      <BackButton onClick={() => registerConfig.clear()} />
    </div>
  );
});
