import { observer } from "mobx-react-lite";
import React, { FunctionComponent, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { NameAddress } from "@chatTypes";
import { userBlockedAddresses } from "@chatStore/messages-slice";
import { UnblockUserPopup } from "@components/chat-actions-popup/unblock-user-popup";
import { HeaderLayout } from "@layouts/index";
import { useStore } from "../../../../stores";
import { formatAddress } from "@utils/format";
import style from "./style.module.scss";
import { AddressBookData } from "../../../../stores/ui-config/address-book";

export const BlockList: FunctionComponent = observer(() => {
  // const language = useLanguage();
  const blockedAddresses = useSelector(userBlockedAddresses);
  const navigate = useNavigate();
  const intl = useIntl();
  const { chainStore, uiConfigStore } = useStore();

  const addresses = uiConfigStore.addressBookConfig.getAddressBook(chainStore.current.chainId).map(
    (data: AddressBookData) => {
      return { name: data.name, address: data.address };
    }
  );
  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "setting.block",
      })}
      onBackButton={() => {
        navigate(-1);
      }}
    >
      <BlockAddresses
        addresses={addresses}
        blockedAddresses={blockedAddresses}
      />
    </HeaderLayout>
  );
});

const BlockAddresses: React.FC<{
  addresses: NameAddress[];
  blockedAddresses: { [key: string]: boolean };
}> = ({ addresses, blockedAddresses }) => {
  const [confirmAction, setConfirmAction] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");

  return (
    <div className={style["chatContainer"]}>
      {confirmAction && (
        <UnblockUserPopup
          setConfirmAction={setConfirmAction}
          userName={userName}
        />
      )}
      <div className={style["messagesContainer"]}>
        {Object.keys(blockedAddresses).filter(
          (contact) => blockedAddresses[contact]
        ).length ? (
          Object.keys(blockedAddresses)
            .filter((contact) => blockedAddresses[contact])
            .map((contact) => {
              const contactName =
                addresses.find((entry) => entry["address"] === contact)?.["name"] ||
                formatAddress(contact);
              return (
                <div key={contact} className={style["messageContainer"]}>
                  <div className={style["initials"]}>
                    {contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className={style["messageInner"]}>
                    <div className={style["name"]}>{contactName}</div>
                  </div>
                  <div>
                    <img
                      src={require("@assets/svg/x-icon.svg")}
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
          <div className={style["messageContainer"]}>
            <div className={style["messageInner"]}>
              <div className={style["name"]}>No Addresses Blocked</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
