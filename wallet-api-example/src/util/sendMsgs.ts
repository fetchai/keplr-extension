import {StdFee} from "@keplr-wallet/types";
import {AccountResponse} from "../types/account";
import {api} from "./api";
import {AuthInfo, Fee, TxBody, TxRaw} from "../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import {SignMode} from "../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";
import {PubKey} from "../proto-types-gen/src/cosmos/crypto/secp256k1/keys";
import {Any} from "../proto-types-gen/src/google/protobuf/any";
import Long from "long";
import {Buffer} from "buffer";
import {TendermintTxTracer} from "@keplr-wallet/cosmos";
import { NetworkConfig, WalletApi } from "@fetchai/wallet-types";

export const sendMsgs = async (
  wallet: WalletApi,
  network: NetworkConfig,
  sender: string,
  proto: Any[],
  fee: StdFee,
  memo: string = ""
) => {
  const account = await fetchAccountInfo(network, sender);
  const { pubKey } = await wallet.accounts.currentAccount();

  if(account) {
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        })
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/cosmos.crypto.secp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: fee.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: fee.gas,
        }),
      }).finish(),
      chainId: network.chainId,
      accountNumber: Long.fromString(account.account_number)
    }

    const signed = await wallet.signing.signDirect(
      network.chainId,
      sender,
      signDoc,
    )

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    }

    const txHash = await broadcastTxSync(network, signedTx.tx);
    const txTracer = new TendermintTxTracer(network.rpcUrl, "/websocket");
    txTracer.traceTx(txHash).then((tx) => {
      alert("Transaction commit successfully");
    });

  }
}

export const fetchAccountInfo = async (network: NetworkConfig, address: string) => {
  try {
    const uri = `${network.restUrl}/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await api<AccountResponse>(uri);

    return response.account;
  } catch (e) {
    console.error("This may be a new account. Please send some tokens to this account first.")
    return undefined;
  }
}

export const broadcastTxSync = async (
  network: NetworkConfig,
  tx: Uint8Array,
): Promise<Uint8Array> => {
  try {
    const params = {
      tx_bytes: Buffer.from(tx as any).toString("base64"),
      mode: "BROADCAST_MODE_SYNC",
    }

    const uri = `${network.restUrl}/cosmos/tx/v1beta1/txs`;
    const response = await api<any>(uri, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const txResponse = response["tx_response"];
    
    if (txResponse.code != null && txResponse.code !== 0) {
      throw new Error(txResponse["raw_log"]);
    }

    return Buffer.from(txResponse.txhash, "hex");
  } catch (e) {
    console.error(e);
    throw new Error("Error broadcasting transaction");
  }
}
