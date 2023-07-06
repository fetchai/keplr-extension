import React, { FunctionComponent, useState, useEffect, useMemo } from "react";
import { HeaderLayout } from "@layouts/index";

import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@components/form";
import { Button, Form } from "reactstrap";
import { useForm } from "react-hook-form";
import { useStore } from "../../../../stores";
import { observer } from "mobx-react-lite";

import styleName from "./name.module.scss";
import { InteractionWaitingData } from "@keplr-wallet/background";
import { useInteractionInfo } from "@hooks/interaction";
import { useSearchParams } from "react-router-dom";

interface FormData {
  name: string;
}

export const ChangeNamePage: FunctionComponent = observer(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { index = "-1 "} = useParams<{ index: string }>();
  const vaultId = searchParams.get("id");

  const intl = useIntl();

  const { keyRingStore, interactionStore } = useStore();

  const interactionInfo = useInteractionInfo(() => {
    interactionStore.rejectAll("change-keyring-name");
  });
  const interactionData: InteractionWaitingData | undefined =
    interactionStore.getAllData("change-keyring-name")[0];

  const { register, handleSubmit, setError, setValue, formState: { errors }  } =
    useForm<FormData>({
      defaultValues: {
        name: "",
      },
    });

  useEffect(() => {
    if (interactionData?.data) {
      const defaultName = (interactionData.data as any).defaultName;
      if (defaultName) {
        setValue("name", defaultName);
      }
    }
  }, [interactionData?.data, setValue]);

  const notEditable =
    interactionData?.data != null &&
    (interactionData.data as any).editable === false;

  const [loading, setLoading] = useState(false);

  const walletName = useMemo(() => {
    return keyRingStore.keyInfos.find((info) => info.id === vaultId);
  }, [keyRingStore.keyInfos, vaultId]);

  const isKeyStoreReady = keyRingStore.status === "unlocked";

  useEffect(() => {
    if (parseInt(index).toString() !== index) {
      throw new Error("Invalid keyring index, check the url");
    }
  }, [index]);

  if (isKeyStoreReady && walletName == null) {
    return null;
  }

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "setting.keyring.change.name",
      })}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      <Form
        className={styleName["container"]}
        onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          try {
            if (vaultId) {
              if (
                interactionInfo.interaction &&
                !interactionInfo.interactionInternal
              ) {
                await interactionStore.approveWithProceedNextV2(
                  interactionStore
                    .getAllData("change-keyring-name")
                    .map((data) => data.id),
                  data.name,
                  (proceedNext) => {
                    if (!proceedNext) {
                      window.close();
                    }
                  }
                );
              } else {
                await keyRingStore.changeKeyRingName(vaultId, data.name);

                navigate("/");
              }
            }
          } catch (e) {
            console.log("Fail to decrypt: " + e.message);
            setError('name', {
              message: intl.formatMessage({
                id: 'setting.keyring.change.input.name.error.invalid',
              }),
            });
            setLoading(false);
          }
        })}
      >
        <Input
          type="text"
          label={intl.formatMessage({
            id: "setting.keyring.change.previous-name",
          })}
          value={walletName?.name ?? ""}
          readOnly={true}
        />
        <Input
          type="text"
          label={intl.formatMessage({
            id: "setting.keyring.change.input.name",
          })}
          error={errors.name && errors.name.message}
          {...register("name",{
            required: intl.formatMessage({
              id: "setting.keyring.change.input.name.error.required",
            }),
          })}
          maxLength={20}
          readOnly={notEditable}
        />

        <div style={{ flex: 1 }} />
        <Button type="submit" color="primary" block data-loading={loading}>
          <FormattedMessage id="setting.keyring.change.name.button.save" />
        </Button>
      </Form>
    </HeaderLayout>
  );
});
