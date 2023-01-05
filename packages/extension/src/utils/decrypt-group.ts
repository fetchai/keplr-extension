import { GroupMessagePayload } from "@chatTypes";
import { decryptMessageContent } from "./decrypt-message";
import { GroupMessageType } from "./encrypt-group";

import { decryptGroupData } from "./symmetric-key";
/**
 * Attempt to decrypt the payload of a group timestamp envelope for the currently
 * selected wallet address
 *
 * @param chainId The selected chain id
 * @param content The base64 encoded cipherText to be decrypted
 * @param isSender The encrypted payload selection based on value
 */
export const decryptGroupTimestamp = async (
  chainId: string,
  content: string,
  isSender: boolean
): Promise<string> => {
  try {
    const data = Buffer.from(content, "base64").toString("ascii");
    const dataEnvelopeDecoded = JSON.parse(data);
    const decodedData = Buffer.from(
      dataEnvelopeDecoded.data,
      "base64"
    ).toString("ascii");
    const parsedData = JSON.parse(decodedData);

    const decryptedData = await decryptMessageContent(
      chainId,
      isSender ? parsedData.encryptedSenderData : parsedData.encryptedTargetData
    );

    const parsedDataString = JSON.parse(decryptedData);
    return parsedDataString.content;
  } catch (e) {
    return content;
  }
};

export const decryptGroupMessage = async (
  content: string,
  chainId: string,
  encryptedSymmetricKey: string
): Promise<GroupMessagePayload> => {
  try {
    const data = Buffer.from(content, "base64").toString("ascii");
    const dataEnvelopeDecoded = JSON.parse(data);
    const decodedData = Buffer.from(
      dataEnvelopeDecoded.data,
      "base64"
    ).toString("ascii");

    const symmetricKey = await decryptMessageContent(
      chainId,
      encryptedSymmetricKey
    );
    const decryptedContent = decryptGroupData(symmetricKey, decodedData);
    const parsedData = JSON.parse(decryptedContent);

    return {
      message: parsedData.content.text,
      type: parsedData.content.type,
    };
  } catch (e) {
    return {
      message: content,
      type: GroupMessageType[GroupMessageType.message],
    };
  }
};
