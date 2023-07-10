import React, { FunctionComponent, useMemo } from "react";

import { useInteractionInfo } from "@hooks/interaction";
import { Button } from "reactstrap";

import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

import style from "./style.module.scss";
import { EmptyLayout } from "@layouts/empty-layout";
import { FormattedMessage } from "react-intl";

export const AccessPage: FunctionComponent = observer(() => {
  const { chainStore, permissionStore } = useStore();

  const waitingPermission = permissionStore.waitingPermissionMergedData;

  const interactionInfo = useInteractionInfo(() => {
    permissionStore.rejectPermissionAll();
    permissionStore.rejectGlobalPermissionAll();
  });

  const isSecretWasmIncluded = useMemo(() => {
    if (waitingPermission) {
      for (const chainId of waitingPermission.chainIds) {
        if (chainStore.hasChain(chainId)) {
          const chainInfo = chainStore.getChain(chainId);
          if (chainInfo.features && chainInfo.features.includes("secretwasm")) {
            return true;
          }
        }
      }
    }
    return false;
  }, [chainStore, waitingPermission]);

  const host = useMemo(() => {
    if (waitingPermission) {
      return waitingPermission.origins
        .map((origin) => {
          return new URL(origin).host;
        })
        .join(", ");
    } else {
      return "";
    }
  }, [waitingPermission]);

  const chainIds = useMemo(() => {
    if (!waitingPermission) {
      return "";
    }

    return waitingPermission?.chainIds.join(", ");
  }, [waitingPermission]);

  return (
    <EmptyLayout style={{ height: "100%", paddingTop: "80px" }}>
      <div className={style["container"]}>
        <img
          src={require("@assets/logo-256.svg")}
          alt="logo"
          style={{ width: "92px", height: "92px", margin: "0 auto" }}
        />
        <h1 className={style["header"]}>
          <FormattedMessage id="access.title" />
        </h1>
        <p className={style["paragraph"]}>
          <FormattedMessage
            id="access.paragraph"
            values={{
              host,
              chainId: chainIds,
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
            <FormattedMessage id="access.permission.account" />
          </li>
          <li>
            <FormattedMessage id="access.permission.tx-request" />
          </li>
          {isSecretWasmIncluded ? (
            <li>
              <FormattedMessage id="access.permission.secret" />
            </li>
          ) : null}
        </ul>
        <div style={{ flex: 1 }} />
        <div className={style["buttons"]}>
          <Button
            className={style["button"]}
            color="danger"
            outline
            onClick={async (e) => {
              e.preventDefault();

              if (waitingPermission) {
                await permissionStore.rejectPermissionWithProceedNext(waitingPermission.ids, proceedNext => {
                  if (!proceedNext) {
                    if (
                      interactionInfo.interaction &&
                      !interactionInfo.interactionInternal
                    ) {
                      window.close();
                    }
                  }
                });
              }
            }}
            data-loading={(() => {
              const obsolete = waitingPermission?.ids?.find((id) => {
                return permissionStore.isObsoleteInteraction(id);
              });
              return !!obsolete;
            })()}
          >
            <FormattedMessage id="access.button.reject" />
          </Button>
          <Button
            className={style["button"]}
            color="primary"
            onClick={async (e) => {
              e.preventDefault();

              if (waitingPermission) {
                await permissionStore.approvePermissionWithProceedNext(
                  waitingPermission.ids,
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
              }
            }}
            disabled={!waitingPermission}
            data-loading={(() => {
              const obsolete = waitingPermission?.ids.find((id) => {
                return permissionStore.isObsoleteInteraction(id);
              });
              return !!obsolete;
            })()}
          >
            <FormattedMessage id="access.button.approve" />
          </Button>
        </div>
      </div>
    </EmptyLayout>
  );
});
