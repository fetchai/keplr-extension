import { cosmos } from "@keplr-wallet/cosmos";
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import ICoin = cosmos.base.v1beta1.ICoin;

export const signTransaction = async (
  data: string,
  chainId: string,
  address: string
) => {
  const payload = JSON.parse(data);
  const msg = {
    chain_id: chainId,
    account_number: payload.account_number,
    msgs: payload.body.messages,
    sequence: payload.sequence,
    fee: {
      gas: "96000",
      amount: [
        {
          denom: "atestfet",
          amount: "480000000000000",
        },
      ],
    },
    memo: "",
  };
  //sendTx
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const keplr = (await getKeplrFromWindow())!;
  const signResponse = await keplr.signAmino(chainId, address, msg, {
    preferNoSetFee: false,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  });
  const signedTx = cosmos.tx.v1beta1.TxRaw.encode({
    bodyBytes: cosmos.tx.v1beta1.TxBody.encode({
      messages: payload.body.messages,
      memo: signResponse.signed.memo,
    }).finish(),
    authInfoBytes: cosmos.tx.v1beta1.AuthInfo.encode({
      signerInfos: [
        {
          publicKey: {
            type_url: "/cosmos.crypto.secp256k1.PubKey",
            value: cosmos.crypto.secp256k1.PubKey.encode({
              key: Buffer.from(signResponse.signature.pub_key.value, "base64"),
            }).finish(),
          },
          modeInfo: payload.authInfo.signerInfos[0].modeInfo,
          sequence: payload.sequence,
        },
      ],
      fee: {
        amount: signResponse.signed.fee.amount as ICoin[],
        gasLimit: payload.sequence,
      },
    }).finish(),
    signatures: [Buffer.from(signResponse.signature.signature, "base64")],
  }).finish();
  // console.log("signedTx", signedTx);
  // const txHash = await keplr.sendTx(
  //   current.chainId,
  //   signedTx,
  //   "async" as BroadcastMode
  // );
  // console.log("txHash", txHash);

  return {
    ...signResponse,
    signedTx,
    message: "Transaction Signed",
  };
};
