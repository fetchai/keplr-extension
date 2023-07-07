import React, { FunctionComponent, useState } from "react";
import ReactDOM from "react-dom";
import style from "./style.module.scss";
import { CosmosApp } from "@keplr-wallet/ledger-cosmos";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import Transport from "@ledgerhq/hw-transport";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { LedgerUtils } from "@keplr-wallet/extension/src/utils";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { Button } from "reactstrap";
import Eth from "@ledgerhq/hw-app-eth";

const FailedLoading: FunctionComponent = () => {
  return (
    <svg
      className={style["spin"]}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12.5" cy="5.5" r="1.5" fill="#5B0A1A" />
      <circle cx="12.5" cy="19.5" r="1.5" fill="#FB486C" />
      <circle
        cx="19.5"
        cy="12.5"
        r="1.5"
        fill="#FFD8E0"
        transform="rotate(90 19.5 12.5)"
      />
      <circle
        cx="5.5"
        cy="12.5"
        r="1.5"
        fill="#A61F3A"
        transform="rotate(90 5.5 12.5)"
      />
      <circle
        cx="17.45"
        cy="7.55"
        r="1.5"
        fill="#FFF7F8"
        transform="rotate(45 17.45 7.55)"
      />
      <circle
        cx="7.55"
        cy="17.45"
        r="1.5"
        fill="#F0224B"
        transform="rotate(45 7.55 17.45)"
      />
      <circle
        cx="17.45"
        cy="17.45"
        r="1.5"
        fill="#FC91A6"
        transform="rotate(135 17.45 17.45)"
      />
      <circle
        cx="7.551"
        cy="7.55"
        r="1.5"
        fill="#771A2D"
        transform="rotate(135 7.55 7.55)"
      />
    </svg>
  );
};

export const LedgerGrantFullScreenPage: FunctionComponent = observer(() => {
  const { uiConfigStore } = useStore();

  const [appIsLoading, setAppIsLoading] = useState("");
  const [status, setStatus] = useState<"select" | "failed" | "success">("select");

  return (
    <div className={style["container"]}>
      <div className={style["inner"]}>
        <div>
          <img
            style={{
              width: "58px",
              height: "58px",
              marginRight: "12px",
            }}
            src={require("../../public/assets/logo-256.svg")}
            alt="logo"
          />
          <img
            style={{
              height: "58px",
            }}
            src={require("../../public/assets/brand-text.png")}
            alt="logo"
          />
        </div>
        <div>
          <h1 className={style["title"]}>Allow Browser to Connect to Ledger</h1>
          <p className={style["description"]}>
            We’ve identified a Chrome related bug where attempting to connect a
            hardware wallet in a popup may cause browser to crash. As a
            temporary measure, you can give Ledger permission in this page.
            Click the button below then try again.
          </p>
          {(() => {
            switch (status) {
              case "failed":
                return (
                  <button
                    className={style["buttonText"]}
                    style={{
                      color: "#F0224B",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();

                      setStatus("select");
                    }}
                  >
                    {"Failed - Try Again"}
                    <div
                      style={{
                        marginLeft: "4px",
                        display: "flex",
                        alignItems: "center",
                        height: "1px",
                      }}
                    >
                      {appIsLoading ? (
                          <FailedLoading />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="25"
                          fill="none"
                          viewBox="0 0 24 25"
                        >
                          <path
                            stroke={"#F0224B"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12.563 5.75l6.75 6.75-6.75 6.75m5.812-6.75H4.687"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              case "success":
                return (
                  <div
                    className={style["buttonText"]}
                    style={{
                      color: "#22AC71",
                      cursor: "auto",
                    }}
                  >
                    Success! You can close this web page.
                  </div>
                );
              case "select":
                return (
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Button
                      color="secondary"
                      text="Cosmos App"
                      isLoading={appIsLoading === "Cosmos"}
                      disabled={!!appIsLoading && appIsLoading !== "Cosmos"}
                      onClick={async () => {
                        if (appIsLoading) {
                          return;
                        }
                        setAppIsLoading("Cosmos");

                        let transport: Transport | undefined = undefined;
                        try {
                          transport = uiConfigStore.useWebHIDLedger
                            ? await TransportWebHID.create()
                            : await TransportWebUSB.create();

                          let app = new CosmosApp("Cosmos", transport);

                          if ((await app.getAppInfo()).app_name === "Cosmos") {
                            setStatus("success");
                            return;
                          }

                          transport = await LedgerUtils.tryAppOpen(
                            transport,
                            "Cosmos"
                          );
                          app = new CosmosApp("Cosmos", transport);

                          if ((await app.getAppInfo()).app_name === "Cosmos") {
                            setStatus("success");
                            return;
                          }

                          setStatus("failed");
                        } catch (e) {
                          console.log(e);

                          setStatus("failed");
                        } finally {
                          transport?.close().catch(console.log);

                          setAppIsLoading("");
                        }                      }}
                    />
                    <Button
                      color="secondary"
                      text="Terra App"
                      isLoading={appIsLoading === "Terra"}
                      disabled={!!appIsLoading && appIsLoading !== "Terra"}
                      onClick={async () => {
                        if (appIsLoading) {
                          return;
                        }
                        setAppIsLoading("Terra");

                        let transport: Transport | undefined = undefined;
                        try {
                          transport = uiConfigStore.useWebHIDLedger
                            ? await TransportWebHID.create()
                            : await TransportWebUSB.create();

                          let app = new CosmosApp("Terra", transport);

                          if ((await app.getAppInfo()).app_name === "Terra") {
                            setStatus("success");
                            return;
                          }

                          transport = await LedgerUtils.tryAppOpen(
                            transport,
                            "Terra"
                          );
                          app = new CosmosApp("Terra", transport);

                          if ((await app.getAppInfo()).app_name === "Terra") {
                            setStatus("success");
                            return;
                          }

                          setStatus("failed");
                        } catch (e) {
                          console.log(e);

                          setStatus("failed");
                        } finally {
                          transport?.close().catch(console.log);

                          setAppIsLoading("");
                        }
                      }}
                    />
                    <Button
                      color="secondary"
                      text="Ethereum App"
                      isLoading={appIsLoading === "Ethereum"}
                      disabled={!!appIsLoading && appIsLoading !== "Ethereum"}
                      onClick={async () => {
                        if (appIsLoading) {
                          return;
                        }
                        setAppIsLoading("Ethereum");

                        let transport: Transport | undefined = undefined;
                        try {
                          transport = uiConfigStore.useWebHIDLedger
                            ? await TransportWebHID.create()
                            : await TransportWebUSB.create();

                          let app = new Eth(transport);

                          try {
                            // Ensure that the keplr can connect to ethereum app on ledger.
                            // getAppConfiguration() works even if the ledger is on screen saver mode.
                            // To detect the screen saver mode, we should request the address before using.
                            await app.getAddress("m/44'/60'/0'/0/0");
                            setStatus("success");
                            return;
                          } catch (e) {
                            console.log(e);
                            // noop
                          }

                          transport = await LedgerUtils.tryAppOpen(
                            transport,
                            "Ethereum"
                          );
                          app = new Eth(transport);

                          // Ensure that the keplr can connect to ethereum app on ledger.
                          // getAppConfiguration() works even if the ledger is on screen saver mode.
                          // To detect the screen saver mode, we should request the address before using.
                          await app.getAddress("m/44'/60'/0'/0/0");
                          setStatus("success");
                          return;
                        } catch (e) {
                          console.log(e);

                          setStatus("failed");
                        } finally {
                          transport?.close().catch(console.log);

                          setAppIsLoading("");
                        }
                      }}
                    />
                  </div>
                );
            }
          })()}
        </div>
      </div>
    </div>
  );
});

ReactDOM.render(<LedgerGrantFullScreenPage />, document.getElementById("app"));
