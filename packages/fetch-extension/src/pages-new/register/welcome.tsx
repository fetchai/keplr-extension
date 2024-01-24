import React, { FunctionComponent } from "react";

import styleWelcome from "./welcome.module.scss";
// import { Button } from "reactstrap";
import { useIntl } from "react-intl";
import { ButtonV2 } from "@components-v2/buttons/button";

export const WelcomePage: FunctionComponent = () => {
  const intl = useIntl();

  return (
    <div style={{ paddingTop: "20px" }}>
      <div className={styleWelcome["title"]}>
        {intl.formatMessage({
          id: "register.welcome.title",
        })}
      </div>
      <div className={styleWelcome["content"]}>
        {intl.formatMessage({
          id: "register.welcome.content",
        })}
      </div>
      <ButtonV2
        onClick={() => {
          if (typeof browser !== "undefined") {
            browser.tabs.getCurrent().then((tab) => {
              if (tab.id) {
                browser.tabs.remove(tab.id);
              } else {
                window.close();
              }
            });
          } else {
            window.close();
          }
        }}
        text={""} // block
        // style={{
        //   marginTop: "60px",
        // }}
      >
        {intl.formatMessage({
          id: "register.welcome.button.done",
        })}
      </ButtonV2>
    </div>
  );
};
