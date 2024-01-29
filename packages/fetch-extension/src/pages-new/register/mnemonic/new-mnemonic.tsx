import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RegisterConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { FormattedMessage, useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import {
  AdvancedBIP44Option,
  BIP44Option,
  useBIP44Option,
} from "../advanced-bip44";
import style from "../style.module.scss";
import { Button, ButtonGroup, Form } from "reactstrap";
import { Input, PasswordInput } from "@components/form";
import { BackButton } from "../index";
import { NewMnemonicConfig, NumWords, useNewMnemonicConfig } from "./hook";
import { useStore } from "../../../stores";
import { ButtonV2 } from "@components-v2/buttons/button";
import { useNotification } from "@components/notification";

export const TypeNewMnemonic = "new-mnemonic";

interface FormData {
  name: string;
  words: string;
  password: string;
  confirmPassword: string;
}

export const NewMnemonicIntro: FunctionComponent<{
  registerConfig: RegisterConfig;
}> = observer(({ registerConfig }) => {
  const { analyticsStore } = useStore();

  return (
    <ButtonV2
      onClick={(e: any) => {
        e.preventDefault();

        registerConfig.setType(TypeNewMnemonic);
        analyticsStore.logEvent("Create account started", {
          registerType: "seed",
        });
      }}
      text={""}
    >
      <FormattedMessage id="register.intro.button.new-account.title" />
    </ButtonV2>
  );
});

export const NewMnemonicPage: FunctionComponent<{
  registerConfig: RegisterConfig;
}> = observer(({ registerConfig }) => {
  const newMnemonicConfig = useNewMnemonicConfig(registerConfig);
  const bip44Option = useBIP44Option();

  return (
    <React.Fragment>
      {newMnemonicConfig.mode === "generate" ? (
        <GenerateMnemonicModePage
          registerConfig={registerConfig}
          newMnemonicConfig={newMnemonicConfig}
          bip44Option={bip44Option}
        />
      ) : null}
      {newMnemonicConfig.mode === "verify" ? (
        <VerifyMnemonicModePage
          registerConfig={registerConfig}
          newMnemonicConfig={newMnemonicConfig}
          bip44Option={bip44Option}
        />
      ) : null}
    </React.Fragment>
  );
});

export const GenerateMnemonicModePage: FunctionComponent<{
  registerConfig: RegisterConfig;
  newMnemonicConfig: NewMnemonicConfig;
  bip44Option: BIP44Option;
}> = observer(({ registerConfig, newMnemonicConfig, bip44Option }) => {
  const intl = useIntl();
  const notification = useNotification();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: newMnemonicConfig.name,
      words: newMnemonicConfig.mnemonic,
      password: "",
      confirmPassword: "",
    },
  });
  const [continueClicked, setContinueClicked] = useState(false);
  const [checkBox1Checked, setCheckBox1Checked] = useState(false);
  const [checkBox2Checked, setCheckBox2Checked] = useState(false);

  const handleCopyClicked = useCallback(async () => {
    await navigator.clipboard.writeText(newMnemonicConfig.mnemonic);
    notification.push({
      placement: "top-center",
      type: "success",
      duration: 2,
      content: "Copied Mnemonic",
      canDelete: true,
      transition: {
        duration: 0.25,
      },
    });
  }, []);
  return (
    <div>
      {!continueClicked ? (
        <div>
          <div>
            <h3 style={{ color: "white" }}>Save your recovery phrase</h3>
            <ul style={{ color: "white" }}>
              These words below will let you recover your wallet if you lose
              your device. We recommend writing down your recovery phrase and
              storing it in a secure offline location, and never share with
              anyone!
            </ul>
          </div>
          <div className={style["title"]}>
            {intl.formatMessage({
              id: "register.create.title",
            })}
            <div style={{ float: "right" }}>
              <ButtonGroup size="sm" style={{ marginBottom: "4px" }}>
                <Button
                  type="button"
                  color="primary"
                  outline={newMnemonicConfig.numWords !== NumWords.WORDS12}
                  onClick={() => {
                    newMnemonicConfig.setNumWords(NumWords.WORDS12);
                  }}
                >
                  <FormattedMessage id="register.create.toggle.word12" />
                </Button>
                <Button
                  type="button"
                  color="primary"
                  outline={newMnemonicConfig.numWords !== NumWords.WORDS24}
                  onClick={() => {
                    newMnemonicConfig.setNumWords(NumWords.WORDS24);
                  }}
                >
                  <FormattedMessage id="register.create.toggle.word24" />
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <div className={style["newMnemonicContainer"]}>
            <div className={style["newMnemonic"]}>
              {newMnemonicConfig.mnemonic}
            </div>
            <img
              className={style["copyImage"]}
              onClick={handleCopyClicked}
              src={require("@assets/svg/wireframe/copy.svg")}
              alt=""
            />
          </div>
          <label className={style["checkbox"]}>
            <input
              type="checkbox"
              checked={checkBox1Checked}
              onChange={() => setCheckBox1Checked(!checkBox1Checked)}
            />{" "}
            I understand that if I lose my recovery phrase, I will not be able
            to access my wallet.
          </label>
          <label className={style["checkbox"]}>
            {" "}
            <input
              type="checkbox"
              checked={checkBox2Checked}
              onChange={() => setCheckBox2Checked(!checkBox2Checked)}
            />{" "}
            I understand that my assets can be stolen if I share my recovery
            phrase with someone else.
          </label>
          <ButtonV2
            disabled={!checkBox1Checked || !checkBox2Checked}
            onClick={() => setContinueClicked(true)}
            text=""
          >
            Continue
          </ButtonV2>
          <BackButton
            onClick={() => {
              registerConfig.clear();
            }}
          />
        </div>
      ) : (
        <div>
          <Form
            className={style["formContainer"]}
            onSubmit={handleSubmit(async (data: FormData) => {
              newMnemonicConfig.setName(data.name);
              newMnemonicConfig.setPassword(data.password);

              newMnemonicConfig.setMode("verify");
            })}
          >
            <Input
              className={style["input"]}
              label={intl.formatMessage({
                id: "register.name",
              })}
              type="text"
              {...register("name", {
                required: intl.formatMessage({
                  id: "register.name.error.required",
                }),
              })}
              error={errors.name && errors.name.message}
              maxLength={20}
            />
            {registerConfig.mode === "create" ? (
              <React.Fragment>
                <PasswordInput
                  label={intl.formatMessage({
                    id: "register.create.input.password",
                  })}
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
                <PasswordInput
                  label={intl.formatMessage({
                    id: "register.create.input.confirm-password",
                  })}
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
                  error={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                />
              </React.Fragment>
            ) : null}
            <AdvancedBIP44Option bip44Option={bip44Option} />
            <ButtonV2 text={""}>
              <FormattedMessage id="register.create.button.next" />
            </ButtonV2>
          </Form>
          <BackButton
            onClick={() => {
              setContinueClicked(false);
            }}
          />
        </div>
      )}
    </div>
  );
});

export const VerifyMnemonicModePage: FunctionComponent<{
  registerConfig: RegisterConfig;
  newMnemonicConfig: NewMnemonicConfig;
  bip44Option: BIP44Option;
}> = observer(({ registerConfig, newMnemonicConfig, bip44Option }) => {
  const wordsSlice = useMemo(() => {
    const words = newMnemonicConfig.mnemonic.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].trim();
    }
    return words;
  }, [newMnemonicConfig.mnemonic]);

  const [randomizedWords, setRandomizedWords] = useState<string[]>([]);
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const [clickedButtons, setClickedButtons] = useState<number[]>([]);

  const firstButtonsPerRow = 6;

  function chunkArray(array: any, size: any) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  const suggestedRows = chunkArray(suggestedWords, firstButtonsPerRow);

  useEffect(() => {
    // Set randomized words.
    const words = newMnemonicConfig.mnemonic.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].trim();
      suggestedWords.push(" ");
    }
    words.sort((word1, word2) => {
      // Sort alphabetically.
      return word1 > word2 ? 1 : -1;
    });
    setRandomizedWords(words);
  }, [newMnemonicConfig.mnemonic]);

  const { analyticsStore } = useStore();
  console.log(clickedButtons);
  return (
    <div>
      <div style={{ minHeight: "153px" }}>
        {suggestedRows.map((row, rowIndex) => (
          <div className={style["buttons"]} key={rowIndex}>
            {row.map((word: any, i: any) => (
              <Button
                className={style["button"]}
                key={word + i.toString()}
                onClick={() => {
                  const updatedSuggestedWords = suggestedWords.slice();
                  const buttonIndex = rowIndex * firstButtonsPerRow + i;

                  if (!clickedButtons.includes(buttonIndex)) {
                    updatedSuggestedWords.splice(buttonIndex, 1);
                    setSuggestedWords(updatedSuggestedWords);
                    setClickedButtons([...clickedButtons, buttonIndex]);
                  }
                  clickedButtons.push(rowIndex * firstButtonsPerRow + i);
                }}
              >
                {word}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <hr />
      <div style={{ minHeight: "153px" }}>
        <div className={style["buttons"]}>
          {randomizedWords.map((word, i) => (
            <Button
              className={style["button"]}
              key={word + i.toString()}
              onClick={() => {
                const buttonIndex = i;

                if (!clickedButtons.includes(buttonIndex)) {
                  const updatedSuggestedWords = suggestedWords.slice();
                  updatedSuggestedWords.push(word);
                  setSuggestedWords(updatedSuggestedWords);
                  setClickedButtons([...clickedButtons, buttonIndex]);
                }
              }}
              disabled={clickedButtons.includes(i)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>

      <ButtonV2
        text=""
        disabled={suggestedWords.join(" ") !== wordsSlice.join(" ")}
        styleProps={{
          marginTop: "30px",
        }}
        onClick={async (e: any) => {
          e.preventDefault();
          try {
            await registerConfig.createMnemonic(
              newMnemonicConfig.name,
              newMnemonicConfig.mnemonic,
              newMnemonicConfig.password,
              bip44Option.bip44HDPath
            );
            analyticsStore.setUserProperties({
              registerType: "seed",
              accountType: "mnemonic",
            });
          } catch (e) {
            alert(e.message ? e.message : e.toString());
            registerConfig.clear();
          }
        }}
        data-loading={registerConfig.isLoading}
      >
        <FormattedMessage id="register.verify.button.register" />
      </ButtonV2>

      <BackButton
        onClick={() => {
          newMnemonicConfig.setMode("generate");
        }}
      />
    </div>
  );
});
