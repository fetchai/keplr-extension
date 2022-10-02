import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { BACKGROUND_PORT } from "@keplr-wallet/router";
import {
  EncryptMessagingMessage,
  GetMessagingPublicKey,
  SignMessagingPayload,
} from "@keplr-wallet/background/build/messaging";
import { MESSAGE_CHANNEL_ID } from "@keplr-wallet/background/build/messaging/constants"

export interface MessageEnvelope {
  data: string; // base64 encoded
  senderPublicKey: string; // base64 encoded
  targetPublicKey: string; // base64 encoded
  signature: string; // base64 encoded signature
  channelId: string;
}

export const encryptAllData = async (
  accessToken: string,
  chainId: string,
  messageStr: any,
  senderAddress: string,
  targetAddress: string
): Promise<string> => {
  const dataEnvelope = await encryptToEnvelope(
    chainId,
    messageStr,
    senderAddress,
    targetAddress,
    accessToken
  )

  return toBase64(Buffer.from(JSON.stringify(dataEnvelope)));
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
  messageStr: string,
  senderAddress: string,
  targetAddress: string,
  accessToken: string
): Promise<MessageEnvelope> {
  // TODO: ideally this is cached
  const requester = new InExtensionMessageRequester();

  // lookup both our (sender) and target public keys
  const senderPublicKey = await requester.sendMessage(
    BACKGROUND_PORT,
    new GetMessagingPublicKey(chainId, accessToken, null)
  );

  const targetPublicKey = await requester.sendMessage(
    BACKGROUND_PORT,
    new GetMessagingPublicKey(chainId, accessToken, targetAddress)
  );

  const message: any = {
    sender: senderPublicKey, //public key
    target: targetPublicKey, // public key
    type: 1, //private_message
    content: {
      text: messageStr,
    },
  };

  // encrypt the message
  const senderCipher = await requester.sendMessage(
    BACKGROUND_PORT,
    new EncryptMessagingMessage(
      chainId,
      senderAddress,
      toBase64(toUtf8(JSON.stringify(message))),
      accessToken
    )
  );

  // encrypt the message
  const targetCipher = await requester.sendMessage(
    BACKGROUND_PORT,
    new EncryptMessagingMessage(
      chainId,
      targetAddress,
      toBase64(toUtf8(JSON.stringify(message))),
      accessToken
    )
  );

  const dataPayload = {
    encryptedSenderData: senderCipher,
    encryptedTargetData: targetCipher,
  };

  const encodedData = toBase64(Buffer.from(JSON.stringify(dataPayload)));

  // get the signature for the payload
  const signature = await requester.sendMessage(
    BACKGROUND_PORT,
    new SignMessagingPayload(
      chainId,
      encodedData
    )
  );

  return {
    data: encodedData,
    senderPublicKey,
    targetPublicKey,
    signature,
    channelId: MESSAGE_CHANNEL_ID
  };
}
