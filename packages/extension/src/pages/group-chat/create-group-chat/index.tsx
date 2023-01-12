import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "@layouts/index";
import style from "./style.module.scss";
import { store } from "@chatStore/index";
import { newGroupDetails, setNewGroupInfo } from "@chatStore/new-group-slice";
import { useSelector } from "react-redux";
import { NewGroupDetails } from "@chatTypes";
import { useNotification } from "@components/notification";
import { Button } from "reactstrap";
import {
  encryptGroupMessage,
  GroupMessageType,
} from "../../../utils/encrypt-group";
import { useStore } from "../../../stores";
import { userDetails } from "@chatStore/user-slice";

export const openValue = true;

export const CreateGroupChat: FunctionComponent = () => {
  const history = useHistory();
  const notification = useNotification();
  const user = useSelector(userDetails);

  const { chainStore, accountStore } = useStore();
  const current = chainStore.current;
  const accountInfo = accountStore.getAccount(current.chainId);
  const newGroupState: NewGroupDetails = useSelector(newGroupDetails);

  const [name, setName] = useState(newGroupState.group.name);
  const [description, setDescription] = useState(
    newGroupState.group.description
  );

  async function validateAndContinue(): Promise<void> {
    if (!name) {
      notification.push({
        type: "warning",
        placement: "top-center",
        duration: 5,
        content: `Please enter the group name`,
        canDelete: true,
        transition: {
          duration: 0.25,
        },
      });
      return;
    }

    const contents = await encryptGroupMessage(
      current.chainId,
      `Group created by -${accountInfo.bech32Address}`,
      GroupMessageType.event,
      accountInfo.bech32Address,
      "new group id",
      user.accessToken
    );

    store.dispatch(
      setNewGroupInfo({
        name,
        description,
        contents,
      })
    );
    history.push({
      pathname: "/group-chat/add-member",
    });
  }

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={"New Group Chat"}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.tokens}>
        <span className={style.groupImageText}>Group Image (optional)</span>
        <img
          className={style.groupImage}
          src={require("@assets/group710.svg")}
        />
        <span className={style.recommendedSize}>
          Recommended size: 120 x 120
        </span>
        <div className={style.input}>
          <span className={style.text}>Group Name</span>
          <input
            className={style.inputText}
            placeholder="Type your group chat name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value.substring(0, 30));
            }}
          />
        </div>
        <div className={style.input}>
          <span className={style.text}>Description (optional)</span>
          <textarea
            className={style.inputText}
            placeholder="Tell us more about your group"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value.substring(0, 256));
            }}
          />
        </div>
        <div className={style.adminToggle}>
          <img className={style.toggle} src={require("@assets/toggle.svg")} />
          <span className={style.adminText}>Only admins can send messages</span>
        </div>
        <Button
          className={style.button}
          size="large"
          onClick={() => validateAndContinue()}
        >
          Add Members
        </Button>
      </div>
    </HeaderLayout>
  );
};
