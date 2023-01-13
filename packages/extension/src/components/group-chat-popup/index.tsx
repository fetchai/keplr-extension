import React from "react";
import style from "./style.module.scss";
import { GroupChatMemberOptions, GroupMembers } from "@chatTypes";
import { formatAddress } from "../../utils/format";

export const GroupChatPopup = ({
  name,
  selectedMember,
  isLoginUserAdmin,
  onClick,
}: {
  name: string;
  selectedMember: GroupMembers | undefined;
  isLoginUserAdmin: boolean;
  onClick: (option: GroupChatMemberOptions) => void;
}) => {
  return (
    <>
      <div className={style.overlay} />
      <div className={style.popup}>
        {
          <Option
            title={`Message ${formatAddress(name)}`}
            onClick={() => onClick(GroupChatMemberOptions.messageMember)}
          />
        }
        {
          //// Todo: add view address book option
          <Option
            title={"Add to Address Book"}
            onClick={() => onClick(GroupChatMemberOptions.addToAddressBook)}
          />
        }
        {isLoginUserAdmin && !selectedMember?.isAdmin && (
          <Option
            title={"Give admin status"}
            onClick={() => onClick(GroupChatMemberOptions.makeAdminStatus)}
          />
        )}
        {isLoginUserAdmin && selectedMember?.isAdmin && (
          <Option
            title={"Remove admin status"}
            onClick={() => onClick(GroupChatMemberOptions.removeAdminStatus)}
          />
        )}
        {isLoginUserAdmin && (
          <Option
            title={`Remove ${name}`}
            onClick={() => onClick(GroupChatMemberOptions.removeMember)}
          />
        )}
      </div>
    </>
  );
};

const Option = ({ title, onClick }: { title: string; onClick: () => void }) => {
  return (
    <div onClick={() => onClick()}>
      <h4>{title}</h4>
    </div>
  );
};
