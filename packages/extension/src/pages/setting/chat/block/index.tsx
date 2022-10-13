import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "../../../../layouts";
import { useIntl } from "react-intl";
// import { useLanguage } from "../../../languages";
import { useHistory } from "react-router";
import style from "./style.module.scss";
// import xIcon from "../../../../public/assets/svg/x-icon.svg";
// import { PageButton } from "../../page-button";

export const BlockList: FunctionComponent = observer(() => {
    // const language = useLanguage();
    const history = useHistory();
    const intl = useIntl();

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
            <div className={style.chatContainer}>
                <div className={style.messagesContainer}>
                    <div className={style.messageContainer}>
                        <div className={style.initials}>
                            J
                        </div>
                        <div className={style.messageInner}>
                            <div className={style.name}>Jerry</div>
                        </div>
                        <div>
                            <img src={require("../../../../public/assets/svg/x-icon.svg")} style={{ width: "80%" }} alt="message" />
                        </div>
                    </div>
                    <div className={style.messageContainer}>
                        <div className={style.initials}>
                            H
                        </div>
                        <div className={style.messageInner}>
                            <div className={style.name}>Harry</div>
                        </div>
                        <div>
                            <img src={require("../../../../public/assets/svg/x-icon.svg")} style={{ width: "80%" }} alt="message" />
                        </div>
                    </div>
                    <div className={style.messageContainer}>
                        <div className={style.initials}>
                            S
                        </div>
                        <div className={style.messageInner}>
                            <div className={style.name}>Someone</div>
                        </div>
                        <div>
                            <img src={require("../../../../public/assets/svg/x-icon.svg")} style={{ width: "80%" }} alt="message" />
                        </div>
                    </div>
                </div>
            </div>
        </HeaderLayout>
    );
});