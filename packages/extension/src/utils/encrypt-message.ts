import { toBase64, toHex, toUtf8 } from "@cosmjs/encoding";
import { serializeSignDoc } from "@cosmjs/launchpad";
import { encrypt } from "eciesjs";
import { store } from "../chatStore";
import { CHAIN_ID_DORADO } from "../config/config";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import {
  EncryptMessagingMessage,
  GetMessagingPublicKey,
  SignMessagingPayload,
} from "@keplr-wallet/background/build/messaging";

export interface MessageEnvelope {
  data: string; // base64 encoded
  senderPublicKey: string; // base64 encoded
  targetPublicKey: string; // base64 encoded
  signature: string; // base64 encoded signature
}

const encryptMessage = async (chain_id: string, account: any, targetPubKey: string, messageStr: string) => {
  const message: any = {
    sender: account.pubKey, //public key
    target: targetPubKey, // public key
    type: 1, //private_message
    content: {
      text: messageStr,
    },
  };

  const encodedRawData = toBase64(Buffer.from(JSON.stringify(message)));
  const encryptedSenderRawData = encrypt(account.pubKey, Buffer.from(encodedRawData));
  const encryptedTargetRawData = encrypt(targetPubKey, Buffer.from(encodedRawData));
  const dataPayload = {
    encryptedSenderData: toBase64(encryptedSenderRawData),
    encryptedTargetData: toBase64(encryptedTargetRawData),
  };
  const msg = {
    chain_id: chain_id,
    account_number: "0",
    sequence: "0",
    fee: {
      gas: "0",
      amount: [],
    },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: {
          signer: account.address,
          data: toBase64(Buffer.from(JSON.stringify(dataPayload))),
        },
      },
    ],
    memo: "",
  };

  const dataEnvalop = {
    data: toHex(serializeSignDoc(msg)),
    senderPublicKey: account.pubKey,
    destinationPublicKey: targetPubKey,
    // signature: res.signature.signature,
    signature: "test signature",
  };
  const encodedData = toBase64(Buffer.from(JSON.stringify(dataEnvalop)));
  return encodedData;
};

export const encryptAllData = async (message: any, targetPubkey: string, senderAddress: string) => {
  const state = store.getState();
  const { user } = state;

  const res = await encryptMessage(
    CHAIN_ID_DORADO,
    {
      address: senderAddress,
      pubKey: user.pubKey, // sender public key
    },
    targetPubkey,
    message
  );
  return res;
};

/**
 * Encrypts the specified message and generates an envelope that can be submitted
 * to the memorandum service
 *
 * @param chainId The current chainId
 * @param message The plain text message to be encrypted
 * @param targetAddress The target address for the message recipient
 */
export async function encryptToEnvelope(
  chainId: string,
  message: string,
  targetAddress: string
): Promise<MessageEnvelope> {
  // TODO: ideally this is cached
  const requester = new InExtensionMessageRequester();

  // encrypt the message
  const cipherText = await requester.sendMessage(
    BACKGROUND_PORT,
    new EncryptMessagingMessage(
      chainId,
      targetAddress,
      toBase64(toUtf8(message))
    )
  );

  // get the signature for the payload
  const signature = await requester.sendMessage(
    BACKGROUND_PORT,
    new SignMessagingPayload(chainId, cipherText)
  );

  // lookup both our (sender) and target public keys
  const senderPublicKey = await requester.sendMessage(
    BACKGROUND_PORT,
    new GetMessagingPublicKey(chainId, null)
  );

  const targetPublicKey = await requester.sendMessage(
    BACKGROUND_PORT,
    new GetMessagingPublicKey(chainId, targetAddress)
  );

  return {
    data: cipherText,
    senderPublicKey,
    targetPublicKey,
    signature,
  };
}
