import React from "react";
import { Input } from "@components/form";
import style from "./style.module.scss";
import { TxRequest } from "./firebase-tx-request-converter";
import { firebaseTxRequestRejected } from "@utils/2fa-transaction";

export const TwoFAInputModal = ({
  onClose,
  txRequest,
}: {
  onClose: () => void;
  txRequest: TxRequest | undefined;
}) => {
  return (
    <React.Fragment>
      <div className={style["overlay"]} />
      <div className={style["popup"]}>
        <h4>2FA Verification</h4>
        <section>
          <p
            style={{ whiteSpace: "pre-wrap" }}
            className={style["textContainer"]}
          >
            {
              "Check your registered device and use this code to proceed with the transaction."
            }
          </p>
        </section>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {Array.from(txRequest?.code ?? "").map((value, index) => (
            <Input
              inputGroupClassName={style["inputText"]}
              key={index}
              type="text"
              value={value}
              maxLength={1}
              readOnly={true}
            />
          ))}
        </div>
        <div className={style["buttonContainer"]}>
          <button
            type="button"
            onClick={async () => {
              await firebaseTxRequestRejected(txRequest?.address ?? "address");
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
