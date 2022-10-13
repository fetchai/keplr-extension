import React, { FunctionComponent, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { HeaderLayout } from "../../../layouts";
import { useIntl } from "react-intl";
// import { useLanguage } from "../../../languages";
import { useHistory } from "react-router";
import style from "./style.module.scss";
import { PageButton } from "../page-button";

export const ChatSettings: FunctionComponent = observer(() => {
  // const language = useLanguage();
  const history = useHistory();
  const intl = useIntl();

  return (
    <HeaderLayout
      showChainName={false}
      canChangeChainInfo={false}
      alternativeTitle={intl.formatMessage({
        id: "setting.chat",
      })}
      onBackButton={() => {
        history.goBack();
      }}
    >
      <div className={style.container}>
        <PageButton
          title={intl.formatMessage({
            id: "setting.block",
          })}
          paragraph={intl.formatMessage({
            id: "setting.block.paragraph",
          })}
          onClick={() => {
            history.push({
              pathname: "/setting/chat/block",
            });
          }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
        />
        <PageButton
          title={intl.formatMessage({
            id: "setting.privacy",
          })}
          paragraph={intl.formatMessage({
            id: "setting.privacy.paragraph",
          })}
          // onClick={() => {
          //   history.push({
          //     pathname: "/setting/block",
          //   });
          // }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
        />
        <PageButton
          title={intl.formatMessage({
            id: "setting.receipts",
          })}
          paragraph={intl.formatMessage({
            id: "setting.receipts.paragraph",
          })}
          // onClick={() => {
          //   history.push({
          //     pathname: "/setting/block",
          //   });
          // }}
          icons={useMemo(
            () => [<i key="next" className="fas fa-chevron-right" />],
            []
          )}
        />
      </div>
    </HeaderLayout>
  );
});