import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";
import { HeaderLayout } from "../../../layouts";
import group710 from "../../../public/assets/group710.svg";
import toggle from "../../../public/assets/toggle.svg";
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
        <img className={style.groupImage} src={group710} />
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
          <img className={style.toggle} src={toggle} />
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
