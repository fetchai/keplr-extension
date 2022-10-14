import { ExtensionKVStore } from "@keplr-wallet/common";
import { useAddressBookConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { userMessages } from "../../../../chatStore/messages-slice";
import { HeaderLayout } from "../../../../layouts";
import { useStore } from "../../../../stores";
import { formatAddress } from "../../../../utils/format";
import { NameAddress } from "../../../chat/users";
import style from "./style.module.scss";
import { UnblockUserPopup } from "./unblock-user-popup";

export const BlockList: FunctionComponent = observer(() => {
  // const language = useLanguage();
  const messages = useSelector(userMessages);
  const history = useHistory();
  const intl = useIntl();
  const { chainStore } = useStore();

  const addressBookConfig = useAddressBookConfig(
    new ExtensionKVStore("address-book"),
    chainStore,
    chainStore.current.chainId,
    {
      setRecipient: (): void => {
        // noop
      },
      setMemo: (): void => {
        // noop
      },
    }
  );

  const addresses = addressBookConfig.addressBookDatas.map((data) => {
    return { name: data.name, address: data.address };
  });
  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "setting.block",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <BlockAddresses addresses={addresses} messages={messages} />
    </HeaderLayout>
  );
});

const BlockAddresses: React.FC<{
  messages: any;
  addresses: NameAddress[];
}> = ({ messages, addresses }) => {
  const [confirmAction, setConfirmAction] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  return (
    <div className={style.chatContainer}>
      {confirmAction && (
        <UnblockUserPopup
          setConfirmAction={setConfirmAction}
          userName={userName}
        />
      )}
      <div className={style.messagesContainer}>
        {Object.keys(messages).filter((contact) => messages[contact].isBlocked)
          .length ? (
          Object.keys(messages)
            .filter((contact) => messages[contact].isBlocked)
            .map((contact) => {
              const contactName =
                addresses.find((entry) => entry.address === contact)?.name ||
                formatAddress(contact);
              return (
                <div key={contact} className={style.messageContainer}>
                  <div className={style.initials}>
                    {contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className={style.messageInner}>
                    <div className={style.name}>{contactName}</div>
                  </div>
                  <div>
                    <img
                      src={require("../../../../public/assets/svg/x-icon.svg")}
                      style={{ width: "80%" }}
                      alt="message"
                      onClick={() => {
                        setUserName(contact);
                        setConfirmAction(true);
                      }}
                    />
                  </div>
                </div>
              );
            })
        ) : (
          <div className={style.messageContainer}>
            <div className={style.messageInner}>
              <div className={style.name}>No Addresses Blocked</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
