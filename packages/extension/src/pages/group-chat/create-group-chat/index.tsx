import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "@layouts/index";
import style from "./style.module.scss";
export const openValue = true;
export const CreateGroupChat: FunctionComponent = () => {
  const history = useHistory();

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
          />
        </div>
        <div className={style.input}>
          <span className={style.text}>Description (optional)</span>
          <textarea
            className={style.inputText}
            placeholder="Tell us more about your group"
          />
        </div>
        <div className={style.adminToggle}>
          <img className={style.toggle} src={require("@assets/toggle.svg")} />
          <span className={style.adminText}>Only admins can send messages</span>
        </div>
        <button
          className={style.button}
          onClick={() =>
            history.push({
              pathname: "/group-chat/add-member",
            })
          }
        >
          Add Members
        </button>
      </div>
    </HeaderLayout>
  );
};
