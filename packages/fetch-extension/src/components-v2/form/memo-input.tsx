import React, { FunctionComponent, useMemo, useState } from "react";
import { FormFeedback, Input } from "reactstrap";
import { IMemoConfig } from "@keplr-wallet/hooks";
import { observer } from "mobx-react-lite";
import { Card } from "../card";

export interface MemoInputProps {
  memoConfig: IMemoConfig;
  label?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

// TODO: Handle the max memo bytes length for each chain.
export const MemoInput: FunctionComponent<MemoInputProps> = observer(
  ({ memoConfig, rows, disabled = false }) => {
    const [inputId] = useState(() => {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      return `input-${Buffer.from(bytes).toString("hex")}`;
    });

    const error = memoConfig.error;
    const errorText: string | undefined = useMemo(() => {
      if (error) {
        switch (error.constructor) {
          default:
            return error.message;
        }
      }
    }, [error]);

    return (
      <React.Fragment>
        <Card
          heading={
            <div>
              Memo{" "}
              <Input
                id={inputId}
                placeholder="Optional"
                className="form-control-alternative"
                type="textarea"
                rows={rows ? rows : 2}
                style={{
                  resize: "none",
                  boxShadow: "none",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  height: "32px",
                  paddingLeft: "0px",
                }}
                value={memoConfig.memo}
                onChange={(e) => {
                  memoConfig.setMemo(e.target.value.substring(0, 256));
                  e.preventDefault();
                }}
                autoComplete="off"
                disabled={disabled}
              />
            </div>
          }
          style={{
            opacity: "0.8",
            fontWeight: "400",
            background: "rgba(255, 255, 255, 0.1)",
          }}
          subheadingStyle={{ fontSize: "14px" }}
        />
        {errorText != null ? (
          <FormFeedback style={{ display: "block" }}>{errorText}</FormFeedback>
        ) : null}
      </React.Fragment>
    );
  }
);
