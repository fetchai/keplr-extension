import { fromBase64, fromHex, fromUtf8 } from "@cosmjs/encoding";
import { decrypt } from "eciesjs";
import { store } from "../chatStore";
import { InExtensionMessageRequester } from "@keplr-wallet/router-extension";
import { DecryptMessagingMessage } from "@keplr-wallet/background/build/messaging";
import { BACKGROUND_PORT } from "@keplr-wallet/router";

export const decryptMessage = async (chainId: string, content: string, isSender: boolean) => {
  try {
    const state = store.getState();
    // const { user } = state;
    const data = Buffer.from(content, "base64").toString("ascii");

    //@ts-ignore "ignoring type checking here"
    const dataEnvelopeDecoded = JSON.parse(data);

    // const decodedData = fromUtf8(fromHex(dataEnvalopDecoded.data));
    const decodedData = Buffer.from(dataEnvelopeDecoded.data, "base64").toString("ascii");

    const parsedData = JSON.parse(decodedData);

    // const msgrevToAscii = msgrev.msgs[0].value.data;

    // const senTargetData = Buffer.from(fromBase64(msgrevToAscii)).toString("ascii");

    // const parsedData = JSON.parse(senTargetData);

    // const decryptedData = decrypt(
    //   user.prvKey,
    //   Buffer.from(isSender ? parsedData.encryptedSenderData : parsedData.encryptedTargetData, "base64")
    // );

    const decryptedData = await decryptMessageContent(
      chainId,
      isSender ? parsedData.encryptedSenderData : parsedData.encryptedTargetData
    );

    const parsedDataString = JSON.parse(decryptedData);
    return parsedDataString.content.text;
  } catch (error) {
    console.log("error : ", error);
    return "";
  }
};

/**
 * Attempt to decrypt the payload of a message envelope for the currently
 * selected wallet address
 *
 * @param chainId The selected chain id
 * @param content The base64 encoded cipherText to be decrypted
 */
export async function decryptMessageContent(
  chainId: string,
  content: string
): Promise<string> {
  // TODO: ideally this is cached
  const requester = new InExtensionMessageRequester();

  // build the decryption request message
  const msg = new DecryptMessagingMessage(chainId, content);
  const decoded = await requester.sendMessage(BACKGROUND_PORT, msg);

  return fromUtf8(fromBase64(decoded));
}
