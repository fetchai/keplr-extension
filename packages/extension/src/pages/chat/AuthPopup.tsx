import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { store } from "../../chatStore";
import { setPrvKey, setPubKey, userDetails } from "../../chatStore/user-slice";
import { PasswordInput } from "../../components/form";
import { useStore } from "../../stores";
import { getWalletKeys } from "../../utils";
import { WarningView } from "../setting/export/warning-view";
import style from "./style.module.scss";

export const AuthPopup = () => {
  const { keyRingStore } = useStore();
  const user = useSelector(userDetails);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const intl = useIntl();

  useEffect(() => {
    console.log(user);
    if (user?.prvKey?.length) setIsOpen(false);
  }, [user]);

  return isOpen ? (
    <div className={style.popupContainer}>
      <WarningView />
      <PasswordInput
        label={intl.formatMessage({
          id: "setting.export.input.password",
        })}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        color="primary"
        block
        onClick={async () => {
          setLoading(true);
          try {
            const data = await keyRingStore.exportKeyRingDatas(password);
            console.log(data, password);
            const mnemonics = data[0].key;
            const keys = await getWalletKeys(mnemonics);
            store.dispatch(setPrvKey(keys.privateKey));
            store.dispatch(setPubKey(keys.publicKey));
            setIsOpen(false);
          } catch (e) {
            console.log("Fail to decrypt: " + e.message);
          } finally {
            setLoading(false);
          }
        }}>
        {loading ? "Loading ..." : <FormattedMessage id="setting.export.button.confirm" />}
      </Button>
    </div>
  ) : (
    ""
  );
};
