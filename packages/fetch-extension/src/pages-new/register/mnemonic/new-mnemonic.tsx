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
import style2 from "./recover-mnemonic.module.scss";
import { Button, ButtonGroup, Form } from "reactstrap";
import { Input, PasswordInput } from "@components-v2/form";
import { BackButton } from "../index";
import { NewMnemonicConfig, NumWords, useNewMnemonicConfig } from "./hook";
import { useStore } from "../../../stores";
import { ButtonV2 } from "@components-v2/buttons/button";
import { useNotification } from "@components/notification";
import { AuthIntro } from "../auth";
import { Card } from "@components-v2/card";
import keyIcon from "@assets/svg/wireframe/key-icon.png";

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
    <React.Fragment>
      {" "}
      <img
        style={{ width: "450px" }}
        src={require("@assets/svg/wireframe/Title.svg")}
        alt="logo"
      />
      <div className={style["titleText"]}>Choose how you want to proceed</div>
      <div
        className={style["card"]}
        onClick={(e: any) => {
          e.preventDefault();

          registerConfig.setType(TypeNewMnemonic);
          analyticsStore.logEvent("Create account started", {
            registerType: "seed",
          });
        }}
      >
        <img src={require("@assets/svg/wireframe/plus-icon.svg")} alt="" />
        <div>
          <div className={style["cardTitle"]}>Create a new wallet </div>
          <div className={style["cardText"]}>
            Create a wallet to store, send, receive and invest in thousands of
            crypto assets
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

export const NewMnemonicPage: FunctionComponent<{
  registerConfig: RegisterConfig;
}> = observer(({ registerConfig }) => {
  const newMnemonicConfig = useNewMnemonicConfig(registerConfig);
  const bip44Option = useBIP44Option();
  const [isMainPage, setIsMainPage] = useState(true);
  const { analyticsStore } = useStore();

  return (
    <React.Fragment>
      {isMainPage && (
        <React.Fragment>
          <BackButton
            onClick={() => {
              registerConfig.clear();
            }}
          />
          <div className={style["pageTitle"]}>Create a new wallet</div>
          <div className={style["newMnemonicText"]}>
            Enter your password to sign in
          </div>
          <Card
            leftImageStyle={{ height: "32px", width: "32px" }}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              height: "78px",
              fontSize: "14px",
              marginBottom: "10px",
            }}
            onClick={(e: any) => {
              e.preventDefault();
              registerConfig.setType("google");
              analyticsStore.logEvent("Create account started", {
                registerType: "google",
              });
            }}
            leftImage={require("@assets/svg/wireframe/google-icon.svg")}
            subheading={"Powered by Web3Auth"}
            heading={"Continue with Google"}
          />
          <Card
            leftImageStyle={{ height: "32px", width: "32px" }}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              height: "78px",
              fontSize: "14px",
            }}
            onClick={(e: any) => {
              e.preventDefault();
              setIsMainPage(false);
              registerConfig.setType(TypeNewMnemonic);
              analyticsStore.logEvent("Create account started", {
                registerType: "seed",
              });
            }}
            leftImage={keyIcon}
            heading={"Create new seed phrase"}
          />

          <div onClick={() => setIsMainPage(false)}>
            <AuthIntro registerConfig={registerConfig} />
          </div>
        </React.Fragment>
      )}
      {!isMainPage && newMnemonicConfig.mode === "generate" ? (
        <GenerateMnemonicModePage
          registerConfig={registerConfig}
          newMnemonicConfig={newMnemonicConfig}
          bip44Option={bip44Option}
          isMainPage={isMainPage}
        />
      ) : null}
      {!isMainPage && newMnemonicConfig.mode === "verify" ? (
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
  isMainPage: boolean;
}> = observer(
  ({ registerConfig, newMnemonicConfig, bip44Option, isMainPage }) => {
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
        <BackButton
          onClick={() => {
            registerConfig.clear();
          }}
        />
        {!isMainPage && !continueClicked ? (
          <div>
            <div>
              <div style={{ color: "white", fontSize: "32px" }}>
                Save your recovery
              </div>
              <div style={{ color: "white", fontSize: "32px" }}> phrase</div>
              <div
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "16px",
                  marginBottom: "5px",
                }}
              >
                These words below will let you recover your wallet if you lose
                your device. We recommend writing down your recovery phrase and
                storing it in a secure offline location, and never share with
                anyone!
              </div>
            </div>
            <div className={style["title"]} style={{ display: "flex" }}>
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
            <AdvancedBIP44Option bip44Option={bip44Option} />
            <ButtonV2
              styleProps={{ marginBottom: "20px" }}
              disabled={!checkBox1Checked || !checkBox2Checked}
              onClick={() => setContinueClicked(true)}
              text=""
            >
              Continue
            </ButtonV2>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Form
              className={style["formContainer"]}
              onSubmit={handleSubmit(async (data: FormData) => {
                newMnemonicConfig.setName(data.name);
                newMnemonicConfig.setPassword(data.password);

                newMnemonicConfig.setMode("verify");
              })}
            >
              <Input
                className={style2["addressInput"]}
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
                style={{ width: "333px !important" }}
              />
              {registerConfig.mode === "create" ? (
                <React.Fragment>
                  <PasswordInput
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
                    passwordLabel="Confirm Password"
                    {...register("confirmPassword", {
                      required: intl.formatMessage({
                        id: "register.create.input.confirm-password.error.required",
                      }),
                      validate: (
                        confirmPassword: string
                      ): string | undefined => {
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
              <ButtonV2 text={""} styleProps={{ marginBottom: "20px" }}>
                <FormattedMessage id="register.create.button.next" />
              </ButtonV2>
            </Form>
          </div>
        )}
      </div>
    );
  }
);

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

  const firstButtonsPerRow = 3;

  function chunkArray(array: any, size: any) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }

  const suggestedRows = chunkArray(suggestedWords, firstButtonsPerRow);

  useEffect(() => {
    const words = newMnemonicConfig.mnemonic.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].trim();
      suggestedWords.push(" ");
    }
    words.sort((word1, word2) => {
      return word1 > word2 ? 1 : -1;
    });
    setRandomizedWords(words);
  }, [newMnemonicConfig.mnemonic]);

  const { analyticsStore } = useStore();

  const handleClickFirstButton = (word: string, index: number) => {
    if (!clickedButtons.includes(index)) {
      const updatedSuggestedWords = [...suggestedWords];
      const updatedClickedButtons = [...clickedButtons];

      if (updatedSuggestedWords[index] === " ") {
        updatedSuggestedWords[index] = word;
        updatedClickedButtons.push(index);
      } else {
        const existingIndex = randomizedWords.findIndex(
          (w) => w === updatedSuggestedWords[index]
        );
        if (existingIndex !== -1) {
          updatedClickedButtons.splice(
            updatedClickedButtons.indexOf(existingIndex),
            1
          );
        }
        updatedSuggestedWords[index] = word;
      }

      setSuggestedWords(updatedSuggestedWords);
      setClickedButtons(updatedClickedButtons);
    }
  };

  const handleClickSecondButton = (index: number) => {
    const wordToAdd = randomizedWords[index];
    const firstEmptyButtonIndex = suggestedWords.findIndex(
      (word) => word === " "
    );

    if (firstEmptyButtonIndex !== -1) {
      const updatedSuggestedWords = [...suggestedWords];
      updatedSuggestedWords[firstEmptyButtonIndex] = wordToAdd;
      setSuggestedWords(updatedSuggestedWords);

      const updatedRandomizedWords = [...randomizedWords];
      updatedRandomizedWords[index] = " ";
      setRandomizedWords(updatedRandomizedWords);
    }
  };

  return (
    <div>
      <BackButton
        onClick={() => {
          newMnemonicConfig.setMode("generate");
        }}
      />
      <div className={style["pageTitle"]}>
        Verify your recovery <br></br> phrase
      </div>
      <div style={{ minHeight: "153px" }}>
        {suggestedRows.map((row, rowIndex) => (
          <div className={style["buttons"]} key={rowIndex}>
            {row.map((word: string, i: number) => (
              <Button
                className={style["button"]}
                key={word + i.toString()}
                onClick={() =>
                  handleClickFirstButton(
                    word,
                    rowIndex * firstButtonsPerRow + i
                  )
                }
              >
                {word}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <hr />
      <div>
        <div className={style["buttons"]}>
          {randomizedWords.map((word, i) => (
            <Button
              className={style["btn2"]}
              key={word + i.toString()}
              onClick={() => handleClickSecondButton(i)}
              disabled={word === " "}
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
          marginBottom: "20px",
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
    </div>
  );
});
