import React, { FunctionComponent, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { EmptyLayout } from "@layouts/empty-layout";
import style from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores";
import { Button } from "reactstrap";
import { useInteractionInfo } from "@hooks/interaction";
import { GlobalPermissionData, InteractionWaitingData } from "@keplr-wallet/background";

export const GrantGlobalPermissionGetChainInfosPage: FunctionComponent<{
  data: InteractionWaitingData<GlobalPermissionData>;
}>  =
  observer(({ data }) => {
    const { permissionStore } = useStore();

    const interactionInfo = useInteractionInfo(() => {
      permissionStore.rejectGlobalPermissionAll();
    });

    const waitingPermissions =
      permissionStore.waitingGlobalPermissionDatas;

    const host = useMemo(() => {
      if (waitingPermissions.length > 0) {
        return waitingPermissions[0].data.origins
          .map((origin) => {
            return new URL(origin).host;
          })
          .join(", ");
      } else {
        return "";
      }
    }, [waitingPermissions]);

    return (
      <EmptyLayout style={{ height: "100%", paddingTop: "80px" }}>
        <div className={style["container"]}>
          <img
            src={require("../../../public/assets/logo-256.svg")}
            alt="logo"
            style={{ width: "92px", height: "92px", margin: "0 auto" }}
          />
          <h1 className={style["header"]}>
            <FormattedMessage id="access.title" />
          </h1>
          <p className={style["paragraph"]}>
            <FormattedMessage
              id="permissions.grant.get-chain-infos.description.title"
              values={{
                host,
                // eslint-disable-next-line react/display-name
                b: (...chunks: any) => <b>{chunks}</b>,
              }}
            />
          </p>
          <div className={style["permission"]}>
            <FormattedMessage id="access.permission.title" />
          </div>
          <ul>
            <li>
              <FormattedMessage id="permissions.grant.get-chain-infos.description.list1" />
            </li>
          </ul>
          <div style={{ flex: 1 }} />
          <div className={style["buttons"]}>
            <Button
              className={style["button"]}
              color="danger"
              outline
              onClick={async (e) => {
                e.preventDefault();

                await permissionStore.approveGlobalPermissionWithProceedNext(
                  data.id,
                  (proceedNext) => {
                    if (!proceedNext) {
                      if (
                        interactionInfo.interaction &&
                        !interactionInfo.interactionInternal
                      ) {
                        window.close();
                      }
                    }
                  }
                );
              }}
              data-loading={permissionStore.isObsoleteInteraction(data.id)}
            >
              <FormattedMessage id="access.button.reject" />
            </Button>
            <Button
              className={style["button"]}
              color="primary"
              onClick={async (e) => {
                e.preventDefault();

                await permissionStore.approveGlobalPermissionWithProceedNext(
                  data.id,
                  (proceedNext) => {
                    if (!proceedNext) {
                      if (
                        interactionInfo.interaction &&
                        !interactionInfo.interactionInternal
                      ) {
                        window.close();
                      }
                    }
                  }
                );
              }}
              disabled={waitingPermissions.length === 0}
              data-loading={permissionStore.isObsoleteInteraction(data.id)}
            >
              <FormattedMessage id="access.button.approve" />
            </Button>
          </div>
        </div>
      </EmptyLayout>
    );
  });
