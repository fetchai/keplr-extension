import React, { useEffect, useState } from "react";
import { toHex } from "@cosmjs/encoding";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { store } from "../../chatStore";
import { setPrvKey, setPubKey, userDetails ,setAccessToken} from "../../chatStore/user-slice";
import { PasswordInput } from "../../components/form";
import { useStore } from "../../stores";
import { getWalletKeys } from "../../utils";
import { getJWT } from "../../utils/auth";
import { WarningView } from "../setting/export/warning-view";
import style from "./style.module.scss";
import { useHistory } from "react-router";

export const AuthPopup = () => {
  const { keyRingStore } = useStore();
  const user = useSelector(userDetails);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { chainStore,accountStore } = useStore();
  const current = chainStore.current;
  const walletAddress = accountStore.getAccount(chainStore.current.chainId).bech32Address;
  const history=useHistory()
  const accountInfo = accountStore.getAccount(current.chainId);
  const pubKey = accountInfo.pubKey;
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
          try {
            const data:any = await keyRingStore.exportKeyRingDatas(password);
            const selected = keyRingStore.multiKeyStoreInfo.find(
              (keyStore) => keyStore.selected
            );

            const mnemonics = data.find((item:any)=>item?.meta?.__id__ ===selected?.meta?.__id__)?.key;
            const keys = await getWalletKeys(mnemonics);
            store.dispatch(setPrvKey(keys.privateKey));
            store.dispatch(setPubKey(keys.publicKey));
            setIsOpen(false);
          } catch (e) {
            console.log("Fail to decrypt: " + e.message);
          } finally {
            setLoading(false);
          }
          try {
            const res = await getJWT(
              current.chainId,
              {
                address: walletAddress,
                pubkey: toHex(pubKey),
              },
              "https://auth-attila.sandbox-london-b.fetch-ai.com"
            );

            // dispatch(tokenStatus(true))
            store.dispatch(setAccessToken(res));
            setIsOpen(false);
            history.replace("/chat");
          } catch (e: any) {
            console.log(e.message);
          }
       
          setLoading(true);
         
        }}>
        {loading ? "Loading ..." : <FormattedMessage id="setting.export.button.confirm" />}
      </Button>
    </div>
  ) : (
    <></>
  );
};
